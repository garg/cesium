/*global define*/
define([
        './freezeObject',
        './defaultValue',
        './defined',
        './Ellipsoid',
        './Cartographic',
        './DeveloperError',
        './Math'
    ], function(
        freezeObject,
        defaultValue,
        defined,
        Ellipsoid,
        Cartographic,
        DeveloperError,
        CesiumMath) {
    "use strict";

    /**
     * A two dimensional region specified as longitude and latitude coordinates.
     *
     * @alias Extent
     * @constructor
     *
     * @param {Number} [west=0.0] The westernmost longitude, in radians, in the range [-Pi, Pi].
     * @param {Number} [south=0.0] The southernmost latitude, in radians, in the range [-Pi/2, Pi/2].
     * @param {Number} [east=0.0] The easternmost longitude, in radians, in the range [-Pi, Pi].
     * @param {Number} [north=0.0] The northernmost latitude, in radians, in the range [-Pi/2, Pi/2].
     */
    var Extent = function(west, south, east, north) {
        /**
         * The westernmost longitude in radians in the range [-Pi, Pi].
         *
         * @type {Number}
         * @default 0.0
         */
        this.west = defaultValue(west, 0.0);

        /**
         * The southernmost latitude in radians in the range [-Pi/2, Pi/2].
         *
         * @type {Number}
         * @default 0.0
         */
        this.south = defaultValue(south, 0.0);

        /**
         * The easternmost longitude in radians in the range [-Pi, Pi].
         *
         * @type {Number}
         * @default 0.0
         */
        this.east = defaultValue(east, 0.0);

        /**
         * The northernmost latitude in radians in the range [-Pi/2, Pi/2].
         *
         * @type {Number}
         * @default 0.0
         */
        this.north = defaultValue(north, 0.0);
    };

    /**
     * Creates an extent given the boundary longitude and latitude in degrees.
     *
     * @memberof Extent
     *
     * @param {Number} [west=0.0] The westernmost longitude in degrees in the range [-180.0, 180.0].
     * @param {Number} [south=0.0] The southernmost latitude in degrees in the range [-90.0, 90.0].
     * @param {Number} [east=0.0] The easternmost longitude in degrees in the range [-180.0, 180.0].
     * @param {Number} [north=0.0] The northernmost latitude in degrees in the range [-90.0, 90.0].
     * @param {Extent} [result] The object onto which to store the result, or undefined if a new instance should be created.
     *
     * @returns {Extent} The modified result parameter or a new Extent instance if none was provided.
     *
     * @example
     * var extent = Cesium.Extent.fromDegrees(0.0, 20.0, 10.0, 30.0);
     */
    Extent.fromDegrees = function(west, south, east, north, result) {
        west = CesiumMath.toRadians(defaultValue(west, 0.0));
        south = CesiumMath.toRadians(defaultValue(south, 0.0));
        east = CesiumMath.toRadians(defaultValue(east, 0.0));
        north = CesiumMath.toRadians(defaultValue(north, 0.0));

        if (!defined(result)) {
            return new Extent(west, south, east, north);
        }

        result.west = west;
        result.south = south;
        result.east = east;
        result.north = north;

        return result;
    };

    /**
     * Creates the smallest possible Extent that encloses all positions in the provided array.
     * @memberof Extent
     *
     * @param {Array} cartographics The list of Cartographic instances.
     * @param {Extent} [result] The object onto which to store the result, or undefined if a new instance should be created.
     * @returns {Extent} The modified result parameter or a new Extent instance if none was provided.
     */
    Extent.fromCartographicArray = function(cartographics, result) {
        //>>includeStart('debug', pragmas.debug);
        if (!defined(cartographics)) {
            throw new DeveloperError('cartographics is required.');
        }
        //>>includeEnd('debug');

        var minLon = Number.MAX_VALUE;
        var maxLon = -Number.MAX_VALUE;
        var minLat = Number.MAX_VALUE;
        var maxLat = -Number.MAX_VALUE;

        for ( var i = 0, len = cartographics.length; i < len; i++) {
            var position = cartographics[i];
            minLon = Math.min(minLon, position.longitude);
            maxLon = Math.max(maxLon, position.longitude);
            minLat = Math.min(minLat, position.latitude);
            maxLat = Math.max(maxLat, position.latitude);
        }

        if (!defined(result)) {
            return new Extent(minLon, minLat, maxLon, maxLat);
        }

        result.west = minLon;
        result.south = minLat;
        result.east = maxLon;
        result.north = maxLat;
        return result;
    };

    /**
     * Duplicates an Extent.
     *
     * @memberof Extent
     *
     * @param {Extent} extent The extent to clone.
     * @param {Extent} [result] The object onto which to store the result, or undefined if a new instance should be created.
     * @returns {Extent} The modified result parameter or a new Extent instance if none was provided. (Returns undefined if extent is undefined)
     */
    Extent.clone = function(extent, result) {
        if (!defined(extent)) {
            return undefined;
        }

        if (!defined(result)) {
            return new Extent(extent.west, extent.south, extent.east, extent.north);
        }

        result.west = extent.west;
        result.south = extent.south;
        result.east = extent.east;
        result.north = extent.north;
        return result;
    };

    /**
     * Duplicates this Extent.
     *
     * @memberof Extent
     *
     * @param {Extent} [result] The object onto which to store the result.
     * @returns {Extent} The modified result parameter or a new Extent instance if none was provided.
     */
    Extent.prototype.clone = function(result) {
        return Extent.clone(this, result);
    };

    /**
     * Compares the provided Extent with this Extent componentwise and returns
     * <code>true</code> if they are equal, <code>false</code> otherwise.
     * @memberof Extent
     *
     * @param {Extent} [other] The Extent to compare.
     * @returns {Boolean} <code>true</code> if the Extents are equal, <code>false</code> otherwise.
     */
    Extent.prototype.equals = function(other) {
        return Extent.equals(this, other);
    };

    /**
     * Compares the provided extents and returns <code>true</code> if they are equal,
     * <code>false</code> otherwise.
     *
     * @memberof Extent
     *
     * @param {Extent} [left] The first Extent.
     * @param {Extent} [right] The second Extent.
     *
     * @returns {Boolean} <code>true</code> if left and right are equal; otherwise <code>false</code>.
     */
    Extent.equals = function(left, right) {
        return (left === right) ||
               ((defined(left)) &&
                (defined(right)) &&
                (left.west === right.west) &&
                (left.south === right.south) &&
                (left.east === right.east) &&
                (left.north === right.north));
    };

    /**
     * Compares the provided Extent with this Extent componentwise and returns
     * <code>true</code> if they are within the provided epsilon,
     * <code>false</code> otherwise.
     * @memberof Extent
     *
     * @param {Extent} [other] The Extent to compare.
     * @param {Number} epsilon The epsilon to use for equality testing.
     * @returns {Boolean} <code>true</code> if the Extents are within the provided epsilon, <code>false</code> otherwise.
     */
    Extent.prototype.equalsEpsilon = function(other, epsilon) {
        //>>includeStart('debug', pragmas.debug);
        if (typeof epsilon !== 'number') {
            throw new DeveloperError('epsilon is required and must be a number.');
        }
        //>>includeEnd('debug');

        return defined(other) &&
               (Math.abs(this.west - other.west) <= epsilon) &&
               (Math.abs(this.south - other.south) <= epsilon) &&
               (Math.abs(this.east - other.east) <= epsilon) &&
               (Math.abs(this.north - other.north) <= epsilon);
    };

    /**
     * Checks an Extent's properties and throws if they are not in valid ranges.
     *
     * @param {Extent} extent The extent to validate
     *
     * @exception {DeveloperError} <code>north</code> must be in the interval [<code>-Pi/2</code>, <code>Pi/2</code>].
     * @exception {DeveloperError} <code>south</code> must be in the interval [<code>-Pi/2</code>, <code>Pi/2</code>].
     * @exception {DeveloperError} <code>east</code> must be in the interval [<code>-Pi</code>, <code>Pi</code>].
     * @exception {DeveloperError} <code>west</code> must be in the interval [<code>-Pi</code>, <code>Pi</code>].
     */
    Extent.validate = function(extent) {
        //>>includeStart('debug', pragmas.debug);
        if (!defined(extent)) {
            throw new DeveloperError('extent is required');
        }

        var north = extent.north;
        if (typeof north !== 'number') {
            throw new DeveloperError('north is required to be a number.');
        }

        if (north < -CesiumMath.PI_OVER_TWO || north > CesiumMath.PI_OVER_TWO) {
            throw new DeveloperError('north must be in the interval [-Pi/2, Pi/2].');
        }

        var south = extent.south;
        if (typeof south !== 'number') {
            throw new DeveloperError('south is required to be a number.');
        }

        if (south < -CesiumMath.PI_OVER_TWO || south > CesiumMath.PI_OVER_TWO) {
            throw new DeveloperError('south must be in the interval [-Pi/2, Pi/2].');
        }

        var west = extent.west;
        if (typeof west !== 'number') {
            throw new DeveloperError('west is required to be a number.');
        }

        if (west < -Math.PI || west > Math.PI) {
            throw new DeveloperError('west must be in the interval [-Pi, Pi].');
        }

        var east = extent.east;
        if (typeof east !== 'number') {
            throw new DeveloperError('east is required to be a number.');
        }

        if (east < -Math.PI || east > Math.PI) {
            throw new DeveloperError('east must be in the interval [-Pi, Pi].');
        }
        //>>includeEnd('debug');
    };

    /**
     * Computes the southwest corner of an extent.
     * @memberof Extent
     *
     * @param {Extent} extent The extent for which to find the corner
     * @param {Cartographic} [result] The object onto which to store the result.
     * @returns {Cartographic} The modified result parameter or a new Cartographic instance if none was provided.
     */
    Extent.getSouthwest = function(extent, result) {
        //>>includeStart('debug', pragmas.debug);
        if (!defined(extent)) {
            throw new DeveloperError('extent is required');
        }
        //>>includeEnd('debug');

        if (!defined(result)) {
            return new Cartographic(extent.west, extent.south);
        }
        result.longitude = extent.west;
        result.latitude = extent.south;
        result.height = 0.0;
        return result;
    };

    /**
     * Computes the northwest corner of an extent.
     * @memberof Extent
     *
     * @param {Extent} extent The extent for which to find the corner
     * @param {Cartographic} [result] The object onto which to store the result.
     * @returns {Cartographic} The modified result parameter or a new Cartographic instance if none was provided.
     */
    Extent.getNorthwest = function(extent, result) {
        //>>includeStart('debug', pragmas.debug);
        if (!defined(extent)) {
            throw new DeveloperError('extent is required');
        }
        //>>includeEnd('debug');

        if (!defined(result)) {
            return new Cartographic(extent.west, extent.north);
        }
        result.longitude = extent.west;
        result.latitude = extent.north;
        result.height = 0.0;
        return result;
    };

    /**
     * Computes the northeast corner of an extent.
     * @memberof Extent
     *
     * @param {Extent} extent The extent for which to find the corner
     * @param {Cartographic} [result] The object onto which to store the result.
     * @returns {Cartographic} The modified result parameter or a new Cartographic instance if none was provided.
     */
    Extent.getNortheast = function(extent, result) {
        //>>includeStart('debug', pragmas.debug);
        if (!defined(extent)) {
            throw new DeveloperError('extent is required');
        }
        //>>includeEnd('debug');

        if (!defined(result)) {
            return new Cartographic(extent.east, extent.north);
        }
        result.longitude = extent.east;
        result.latitude = extent.north;
        result.height = 0.0;
        return result;
    };

    /**
     * Computes the southeast corner of an extent.
     * @memberof Extent
     *
     * @param {Extent} extent The extent for which to find the corner
     * @param {Cartographic} [result] The object onto which to store the result.
     * @returns {Cartographic} The modified result parameter or a new Cartographic instance if none was provided.
     */
    Extent.getSoutheast = function(extent, result) {
        //>>includeStart('debug', pragmas.debug);
        if (!defined(extent)) {
            throw new DeveloperError('extent is required');
        }
        //>>includeEnd('debug');

        if (!defined(result)) {
            return new Cartographic(extent.east, extent.south);
        }
        result.longitude = extent.east;
        result.latitude = extent.south;
        result.height = 0.0;
        return result;
    };

    /**
     * Computes the center of an extent.
     * @memberof Extent
     *
     * @param {Extent} extent The extent for which to find the center
     * @param {Cartographic} [result] The object onto which to store the result.
     * @returns {Cartographic} The modified result parameter or a new Cartographic instance if none was provided.
     */
    Extent.getCenter = function(extent, result) {
        //>>includeStart('debug', pragmas.debug);
        if (!defined(extent)) {
            throw new DeveloperError('extent is required');
        }
        //>>includeEnd('debug');

        if (!defined(result)) {
            return new Cartographic((extent.west + extent.east) * 0.5, (extent.south + extent.north) * 0.5);
        }
        result.longitude = (extent.west + extent.east) * 0.5;
        result.latitude = (extent.south + extent.north) * 0.5;
        result.height = 0.0;
        return result;
    };

    /**
     * Computes the intersection of two extents
     * @memberof Extent
     *
     * @param {Extent} extent On extent to find an intersection
     * @param otherExtent Another extent to find an intersection
     * @param {Extent} [result] The object onto which to store the result.
     * @returns {Extent} The modified result parameter or a new Extent instance if none was provided.
     */
    Extent.intersectWith = function(extent, otherExtent, result) {
        //>>includeStart('debug', pragmas.debug);
        if (!defined(extent)) {
            throw new DeveloperError('extent is required');
        }
        if (!defined(otherExtent)) {
            throw new DeveloperError('otherExtent is required.');
        }
        //>>includeEnd('debug');

        var west = Math.max(extent.west, otherExtent.west);
        var south = Math.max(extent.south, otherExtent.south);
        var east = Math.min(extent.east, otherExtent.east);
        var north = Math.min(extent.north, otherExtent.north);
        if (!defined(result)) {
            return new Extent(west, south, east, north);
        }
        result.west = west;
        result.south = south;
        result.east = east;
        result.north = north;
        return result;
    };

    /**
     * Returns true if the cartographic is on or inside the extent, false otherwise.
     * @memberof Extent
     *
     * @param {Extent} extent The extent
     * @param {Cartographic} cartographic The cartographic to test.
     * @returns {Boolean} true if the provided cartographic is inside the extent, false otherwise.
     */
    Extent.contains = function(extent, cartographic) {
        //>>includeStart('debug', pragmas.debug);
        if (!defined(extent)) {
            throw new DeveloperError('extent is required');
        }
        if (!defined(cartographic)) {
            throw new DeveloperError('cartographic is required.');
        }
        //>>includeEnd('debug');

        return cartographic.longitude >= extent.west &&
               cartographic.longitude <= extent.east &&
               cartographic.latitude >= extent.south &&
               cartographic.latitude <= extent.north;
    };

    /**
     * Determines if the extent is empty, i.e., if <code>west >= east</code>
     * or <code>south >= north</code>.
     *
     * @memberof Extent
     *
     * @param {Extent} extent The extent
     * @returns {Boolean} True if the extent is empty; otherwise, false.
     */
    Extent.isEmpty = function(extent) {
        //>>includeStart('debug', pragmas.debug);
        if (!defined(extent)) {
            throw new DeveloperError('extent is required');
        }
        //>>includeEnd('debug');

        return extent.west >= extent.east || extent.south >= extent.north;
    };

    var subsampleLlaScratch = new Cartographic();
    /**
     * Samples an extent so that it includes a list of Cartesian points suitable for passing to
     * {@link BoundingSphere#fromPoints}.  Sampling is necessary to account
     * for extents that cover the poles or cross the equator.
     *
     * @param {Extent} extent The extent to subsample.
     * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid to use.
     * @param {Number} [surfaceHeight=0.0] The height of the extent above the ellipsoid.
     * @param {Array} [result] The array of Cartesians onto which to store the result.
     * @returns {Array} The modified result parameter or a new Array of Cartesians instances if none was provided.
     */
    Extent.subsample = function(extent, ellipsoid, surfaceHeight, result) {
        //>>includeStart('debug', pragmas.debug);
        if (!defined(extent)) {
            throw new DeveloperError('extent is required');
        }
        //>>includeEnd('debug');

        ellipsoid = defaultValue(ellipsoid, Ellipsoid.WGS84);
        surfaceHeight = defaultValue(surfaceHeight, 0.0);

        if (!defined(result)) {
            result = [];
        }
        var length = 0;

        var north = extent.north;
        var south = extent.south;
        var east = extent.east;
        var west = extent.west;

        var lla = subsampleLlaScratch;
        lla.height = surfaceHeight;

        lla.longitude = west;
        lla.latitude = north;
        result[length] = ellipsoid.cartographicToCartesian(lla, result[length]);
        length++;

        lla.longitude = east;
        result[length] = ellipsoid.cartographicToCartesian(lla, result[length]);
        length++;

        lla.latitude = south;
        result[length] = ellipsoid.cartographicToCartesian(lla, result[length]);
        length++;

        lla.longitude = west;
        result[length] = ellipsoid.cartographicToCartesian(lla, result[length]);
        length++;

        if (north < 0.0) {
            lla.latitude = north;
        } else if (south > 0.0) {
            lla.latitude = south;
        } else {
            lla.latitude = 0.0;
        }

        for ( var i = 1; i < 8; ++i) {
            var temp = -Math.PI + i * CesiumMath.PI_OVER_TWO;
            if (west < temp && temp < east) {
                lla.longitude = temp;
                result[length] = ellipsoid.cartographicToCartesian(lla, result[length]);
                length++;
            }
        }

        if (lla.latitude === 0.0) {
            lla.longitude = west;
            result[length] = ellipsoid.cartographicToCartesian(lla, result[length]);
            length++;
            lla.longitude = east;
            result[length] = ellipsoid.cartographicToCartesian(lla, result[length]);
            length++;
        }
        result.length = length;
        return result;
    };

    /**
     * The largest possible extent.
     * @memberof Extent
     * @type Extent
    */
    Extent.MAX_VALUE = freezeObject(new Extent(-Math.PI, -CesiumMath.PI_OVER_TWO, Math.PI, CesiumMath.PI_OVER_TWO));

    return Extent;
});
