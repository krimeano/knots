"use strict";
var LinealAlgebra = {
    /**
     * Scalar product of two vectors
     * @param {Number[]} a
     * @param {Number[]} b
     * @return {Number}
     */
    aob: function (a, b) {
        if (a.length !== b.length) {
            throw "Multiplied vectors should have the same dimension";
        }
        if (!a.length) {
            return 0;
        }
        return parseFloat(a.reduce((s, x, i, v) => s + x * b[i], 0).toFixed(3)) || 0;
    },

    /**
     * Vector product of two vectors
     * @param {Number[]} a
     * @param {Number[]} b
     * @returns {*}
     */
    axb: function (a, b) {
        if (a.length !== b.length) {
            throw "Multiplied vectors should have the same dimension";
        }
        var abm = [a, b];
        switch (a.length) {
            case 0:
                return null;
            case 1:
                return a[0] * b[0];
            case 2:
                return LinealAlgebra.det(abm);
            case 3:
                return [1, 1, 1].map((x, j)=>(j % 2 ? -1 : 1) * LinealAlgebra.det(LinealAlgebra.minor_sub(j, abm)));
            default:
                throw "You can't multiply N vectors with dimensions > N+1";
        }
    },


    /**
     * return minor of matrix
     * @param {Number} i
     * @param {Number} j
     * @param {Number[][]} matrix
     * @returns {Number[][]}
     */
    minor: function (i, j, matrix) {
        return LinealAlgebra.minor_sub(j, matrix.slice(0, i).concat(matrix.slice(i + 1)))
    },

    /**
     * reduces one column of matrix without row
     * @param {Number} j
     * @param {Number[][]} sub_matrix
     * @returns {Number[][]}
     */
    minor_sub: function (j, sub_matrix) {
        return sub_matrix.map(y=>y.slice(0, j).concat(y.slice(j + 1)));
    },

    /**
     *
     * @param {Number[][]} matrix
     * @returns {Number}
     */
    det: function (matrix) {
        var h = matrix.length, w = h && matrix[0].length;
        //console.log(w, h, JSON.stringify(matrix));
        if (h !== w) {
            return 0;
        }
        if (!matrix.length) {
            return 0;
        }
        if (matrix.length == 1) {
            return 1 * matrix[0][0];
        }

        return matrix[0].reduce(
            (s, x, j, v)=>s + (x && (x * (j % 2 ? -1 : 1) * LinealAlgebra.det(LinealAlgebra.minor(0, j, matrix)))), 0
        );
    },

    /**
     * Product of matrix and vector
     * @param {Number[][]} matrix
     * @param {Number[]} a
     * @returns {Number[]}
     */
    mxa: function (matrix, a) {
        if (!matrix.length) {
            return [];
        }
        var w = a.length;
        if (matrix[0].length !== w) {
            throw "width of matrix should be equal vector length";
        }
        return matrix.map(b => LinealAlgebra.aob(a, b));
    },

    /**
     *
     * @param {Number} rad
     * @param {Number[]} a
     * @returns {Number[]}
     */
    rotate_a: function (rad, a) {
        var m = [[Math.cos(rad), -Math.sin(rad)], [Math.sin(rad), Math.cos(rad)]];
        return LinealAlgebra.mxa(m, a);
    },

    /**
     *
     * @param {Number} deg
     * @param {Number[]} a
     * @returns {Number[]}
     */
    rotate_a_deg: function (deg, a) {
        return LinealAlgebra.rotate_a(Math.PI * deg / 180, a);
    },

    rotate_right_cw: function (a) {
        return LinealAlgebra.rotate_a_deg(90, a);
    },

    rotate_right_ccw: function (a) {
        return LinealAlgebra.rotate_a_deg(-90, a);
    },

    /**
     *
     * Creates a vector from two points
     * @param {Number[]} p0
     * @param {Number[]} p1
     * @returns {Number[]}
     */
    pp2a: function (p0, p1) {
        if (p0.length !== p1.length) {
            throw "Two points should have the same dimension";
        }
        return p0.map((x, i)=>p1[i] - x);
    },

    minus_a: function (a) {
        return a.map(x=>-x);
    },

    /**
     * Sum of two vectors
     * @param {Number[]} a
     * @param {Number[]} b
     * @returns {Number[]}
     */
    apb: function (a, b) {
        return a.map((x, i)=>x + b[i])
    },

    a_length: function (a) {
        return parseFloat(Math.sqrt(a.reduce((s, x, i, v)=>s + x * x, 0)).toFixed(3)) || 0;
    },

    sin_ab: function (a, b) {
        var abs_a = LinealAlgebra.a_length(a), abs_b = LinealAlgebra.a_length(b);
        if (!abs_a || !abs_b) {
            return NaN;
        }
        return parseFloat((LinealAlgebra.axb(a, b) / abs_a / abs_b).toFixed(5));
    },

    cos_ab: function (a, b) {
        var abs_a = LinealAlgebra.a_length(a), abs_b = LinealAlgebra.a_length(b);
        if (!abs_a || !abs_b) {
            return NaN;
        }
        return parseFloat((LinealAlgebra.aob(a, b) / abs_a / abs_b).toFixed(5));
    },

    ab_rad: function (a, b) {
        var rad_s = Math.asin(LinealAlgebra.sin_ab(a, b)),
            rad_c = Math.acos(LinealAlgebra.cos_ab(a, b));

        return (rad_s < 0 ? -rad_c : rad_c) || rad_c;
    },

    xy2radial: function (a) {
        return {r: LinealAlgebra.a_length(a), a: LinealAlgebra.ab_rad([1, 0], a)};
    },

    radial2xy: function (ra, rounded) {
        var x = ra.r * Math.cos(ra.a),
            y = ra.r * Math.sin(ra.a);
        if (rounded) {
            x = Math.round(x);
            y = Math.round(y);
        }
        return [x, y];
    },


    weightedX: function (x0, x1, w0, w1) {
        if (w0 == w1) {
            return (x0 + x1) / 2;
        }
        return (x0 * w0 + x1 * w1) / (w0 + w1);
    },

    weightedPoint: function (p0, p1, w0, w1) {
        return p0.map((x, i) => LinealAlgebra.weightedX(x, p1[i], w0, w1))
    },

    centerPoint: function (p0, p1) {
        return LinealAlgebra.weightedPoint(p0, p1, 1, 1);
    },


    /**
     * Finds straight line parameters by point and collinear vector
     * @param {Number[]} p
     * @param {Number[]} a
     * @returns {{A: number, B: number, C: number}}
     */
    pa2s: function (p, a) {
        return {
            A: -a[1],
            B: a[0],
            C: LinealAlgebra.det([p, a])
        }
    },

    /**
     *
     * @param {{A: number, B: number, C: number}} s0
     * @param {{A: number, B: number, C: number}} s1
     * @returns {Number[]}
     */
    straights_cross: function (s0, s1) {
        var d = LinealAlgebra.det([[s0.A, s0.B], [s1.A, s1.B]]),
            xd = LinealAlgebra.det([[s0.B, s0.C], [s1.B, s1.C]]),
            yd = LinealAlgebra.det([[s0.C, s0.A], [s1.C, s1.A]]);
        //if (!d) {
        //    return [Infinity, Infinity];
        //}
        return [xd / d, yd / d];
    }
};