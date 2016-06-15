"use strict";
var LinealAlgebra = {
    /**
     * Scalar product of two vectors
     * @param {Array} a
     * @param {Array} b
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
     * @param {Array} a
     * @param {Array} b
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
     * @param {Array[]} matrix
     * @returns {Array[]}
     */
    minor: function (i, j, matrix) {
        return LinealAlgebra.minor_sub(j, matrix.slice(0, i).concat(matrix.slice(i + 1)))
    },

    /**
     * reduces one column of matrix without row
     * @param {Number} j
     * @param {Array[]} sub_matrix
     * @returns {Array[]}
     */
    minor_sub: function (j, sub_matrix) {
        return sub_matrix.map(y=>y.slice(0, j).concat(y.slice(j + 1)));
    },

    /**
     *
     * @param {Array[]} matrix
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
     * @param {Array[]} matrix
     * @param {Array} a
     * @returns {Array}
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
     * @param {Array} a
     * @returns {Array}
     */
    rotate_a: function (rad, a) {
        var m = [[Math.cos(rad), -Math.sin(rad)], [Math.sin(rad), Math.cos(rad)]];
        return LinealAlgebra.mxa(m, a);
    },

    /**
     *
     * @param {Number} deg
     * @param {Array} a
     * @returns {Array}
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
     * @param {Array} p0
     * @param {Array} p1
     * @returns {Array}
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
     * @param {Array} a
     * @param {Array} b
     * @returns {Array}
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
        return LinealAlgebra.axb(a, b) / abs_a / abs_b;
    },

    cos_ab: function (a, b) {
        var abs_a = LinealAlgebra.a_length(a), abs_b = LinealAlgebra.a_length(b);
        if (!abs_a || !abs_b) {
            return NaN;
        }
        return LinealAlgebra.aob(a, b) / abs_a / abs_b;
    },

    ab_deg: function (a, b) {
        var deg_s = Math.asin(LinealAlgebra.sin_ab(a, b)),
            deg_c = Math.acos(LinealAlgebra.cos_ab(a, b));
        return (deg_s < 0 ? -deg_c : deg_c) || deg_c;
    }
};