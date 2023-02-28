"use strict";

(function () {
  function r(e, n, t) {
    function o(i, f) {
      if (!n[i]) {
        if (!e[i]) {
          var c = "function" == typeof require && require;
          if (!f && c) return c(i, !0);
          if (u) return u(i, !0);
          var a = new Error("Cannot find module '" + i + "'");
          throw a.code = "MODULE_NOT_FOUND", a;
        }

        var p = n[i] = {
          exports: {}
        };
        e[i][0].call(p.exports, function (r) {
          var n = e[i][1][r];
          return o(n || r);
        }, p, p.exports, r, e, n, t);
      }

      return n[i].exports;
    }

    for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) o(t[i]);

    return o;
  }

  return r;
})()({
  1: [function (require, module, exports) {
    // console.log(`You can write scripts here that will be browserfied`)
    const {
      initAll
    } = require('govuk-frontend');

    window.initAll = initAll;
    window.accessibleAutocomplete = require('accessible-autocomplete');
    window.initReorderList = require('../templates/components/reorder-list/reorder-list.js');
  }, {
    "../templates/components/reorder-list/reorder-list.js": 2,
    "accessible-autocomplete": 3,
    "govuk-frontend": 4
  }],
  2: [function (require, module, exports) {
    module.exports = rootElementClass => {
      const rootElement = $(`.${rootElementClass}`);

      const updateRow = row => {
        row.find('.reorder-up').prop('hidden', row.prev('.govuk-summary-list__row').length === 0);
        row.find('.reorder-down').prop('hidden', row.next('.govuk-summary-list__row').length === 0);
      };

      const updateRows = (current, swap) => {
        const currentPriority = current.find('.reorder-priority');
        const currentPriorityValue = currentPriority.val();
        const swapPriority = swap.find('.reorder-priority');
        const swapPriorityValue = swapPriority.val();
        currentPriority.val(swapPriorityValue);
        swapPriority.val(currentPriorityValue);
        updateRow(current);
        updateRow(swap);
      };

      rootElement.find('.reorder-up').click(({
        target
      }) => {
        const current = $(target).closest('.govuk-summary-list__row');
        const previous = current.prev('.govuk-summary-list__row');

        if (previous.length !== 0) {
          current.insertBefore(previous);
          updateRows(current, previous);
        }

        return false;
      });
      rootElement.find('.reorder-down').click(({
        target
      }) => {
        const current = $(target).closest('.govuk-summary-list__row');
        const next = current.next('.govuk-summary-list__row');

        if (next.length !== 0) {
          current.insertAfter(next);
          updateRows(current, next);
        }

        return false;
      });
    };
  }, {}],
  3: [function (require, module, exports) {
    (function webpackUniversalModuleDefinition(e, t) {
      "object" == typeof exports && "object" == typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define([], t) : "object" == typeof exports ? exports["accessibleAutocomplete"] = t() : e["accessibleAutocomplete"] = t();
    })(window, function () {
      return function (n) {
        var r = {};

        function o(e) {
          if (r[e]) return r[e].exports;
          var t = r[e] = {
            i: e,
            l: !1,
            exports: {}
          };
          return n[e].call(t.exports, t, t.exports, o), t.l = !0, t.exports;
        }

        return o.m = n, o.c = r, o.d = function (e, t, n) {
          o.o(e, t) || Object.defineProperty(e, t, {
            enumerable: !0,
            get: n
          });
        }, o.r = function (e) {
          "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
          }), Object.defineProperty(e, "__esModule", {
            value: !0
          });
        }, o.t = function (t, e) {
          if (1 & e && (t = o(t)), 8 & e) return t;
          if (4 & e && "object" == typeof t && t && t.__esModule) return t;
          var n = Object.create(null);
          if (o.r(n), Object.defineProperty(n, "default", {
            enumerable: !0,
            value: t
          }), 2 & e && "string" != typeof t) for (var r in t) o.d(n, r, function (e) {
            return t[e];
          }.bind(null, r));
          return n;
        }, o.n = function (e) {
          var t = e && e.__esModule ? function () {
            return e["default"];
          } : function () {
            return e;
          };
          return o.d(t, "a", t), t;
        }, o.o = function (e, t) {
          return Object.prototype.hasOwnProperty.call(e, t);
        }, o.p = "/", o(o.s = 37);
      }([function (e, t, n) {
        var m = n(1),
            v = n(6),
            y = n(7),
            _ = n(16),
            g = n(18),
            b = "prototype",
            w = function (e, t, n) {
          var r,
              o,
              i,
              u,
              a = e & w.F,
              s = e & w.G,
              l = e & w.S,
              c = e & w.P,
              p = e & w.B,
              f = s ? m : l ? m[t] || (m[t] = {}) : (m[t] || {})[b],
              d = s ? v : v[t] || (v[t] = {}),
              h = d[b] || (d[b] = {});

          for (r in s && (n = t), n) i = ((o = !a && f && f[r] !== undefined) ? f : n)[r], u = p && o ? g(i, m) : c && "function" == typeof i ? g(Function.call, i) : i, f && _(f, r, i, e & w.U), d[r] != i && y(d, r, u), c && h[r] != i && (h[r] = i);
        };

        m.core = v, w.F = 1, w.G = 2, w.S = 4, w.P = 8, w.B = 16, w.W = 32, w.U = 64, w.R = 128, e.exports = w;
      }, function (e, t) {
        var n = e.exports = "undefined" != typeof window && window.Math == Math ? window : "undefined" != typeof self && self.Math == Math ? self : Function("return this")();
        "number" == typeof __g && (__g = n);
      }, function (e, t) {
        e.exports = function (e) {
          return "object" == typeof e ? null !== e : "function" == typeof e;
        };
      }, function (e, t, n) {
        e.exports = !n(4)(function () {
          return 7 != Object.defineProperty({}, "a", {
            get: function () {
              return 7;
            }
          }).a;
        });
      }, function (e, t) {
        e.exports = function (e) {
          try {
            return !!e();
          } catch (t) {
            return !0;
          }
        };
      }, function (e, t, n) {
        "use strict";

        n.r(t), n.d(t, "h", function () {
          return r;
        }), n.d(t, "createElement", function () {
          return r;
        }), n.d(t, "cloneElement", function () {
          return i;
        }), n.d(t, "Component", function () {
          return _;
        }), n.d(t, "render", function () {
          return g;
        }), n.d(t, "rerender", function () {
          return f;
        }), n.d(t, "options", function () {
          return E;
        });

        var s = function s() {},
            E = {},
            l = [],
            c = [];

        function r(e, t) {
          var n,
              r,
              o,
              i,
              u = c;

          for (i = arguments.length; 2 < i--;) l.push(arguments[i]);

          for (t && null != t.children && (l.length || l.push(t.children), delete t.children); l.length;) if ((r = l.pop()) && r.pop !== undefined) for (i = r.length; i--;) l.push(r[i]);else "boolean" == typeof r && (r = null), (o = "function" != typeof e) && (null == r ? r = "" : "number" == typeof r ? r = String(r) : "string" != typeof r && (o = !1)), o && n ? u[u.length - 1] += r : u === c ? u = [r] : u.push(r), n = o;

          var a = new s();
          return a.nodeName = e, a.children = u, a.attributes = null == t ? undefined : t, a.key = null == t ? undefined : t.key, E.vnode !== undefined && E.vnode(a), a;
        }

        function M(e, t) {
          for (var n in t) e[n] = t[n];

          return e;
        }

        var o = "function" == typeof Promise ? Promise.resolve().then.bind(Promise.resolve()) : setTimeout;

        function i(e, t) {
          return r(e.nodeName, M(M({}, e.attributes), t), 2 < arguments.length ? [].slice.call(arguments, 2) : e.children);
        }

        var p = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i,
            u = [];

        function a(e) {
          !e._dirty && (e._dirty = !0) && 1 == u.push(e) && (E.debounceRendering || o)(f);
        }

        function f() {
          var e,
              t = u;

          for (u = []; e = t.pop();) e._dirty && V(e);
        }

        function N(e, t) {
          return e.normalizedNodeName === t || e.nodeName.toLowerCase() === t.toLowerCase();
        }

        function I(e) {
          var t = M({}, e.attributes);
          t.children = e.children;
          var n = e.nodeName.defaultProps;
          if (n !== undefined) for (var r in n) t[r] === undefined && (t[r] = n[r]);
          return t;
        }

        function k(e) {
          var t = e.parentNode;
          t && t.removeChild(e);
        }

        function v(e, t, n, r, o) {
          if ("className" === t && (t = "class"), "key" === t) ;else if ("ref" === t) n && n(null), r && r(e);else if ("class" !== t || o) {
            if ("style" === t) {
              if (r && "string" != typeof r && "string" != typeof n || (e.style.cssText = r || ""), r && "object" == typeof r) {
                if ("string" != typeof n) for (var i in n) i in r || (e.style[i] = "");

                for (var i in r) e.style[i] = "number" == typeof r[i] && !1 === p.test(i) ? r[i] + "px" : r[i];
              }
            } else if ("dangerouslySetInnerHTML" === t) r && (e.innerHTML = r.__html || "");else if ("o" == t[0] && "n" == t[1]) {
              var u = t !== (t = t.replace(/Capture$/, ""));
              t = t.toLowerCase().substring(2), r ? n || e.addEventListener(t, d, u) : e.removeEventListener(t, d, u), (e._listeners || (e._listeners = {}))[t] = r;
            } else if ("list" !== t && "type" !== t && !o && t in e) {
              try {
                e[t] = null == r ? "" : r;
              } catch (s) {}

              null != r && !1 !== r || "spellcheck" == t || e.removeAttribute(t);
            } else {
              var a = o && t !== (t = t.replace(/^xlink:?/, ""));
              null == r || !1 === r ? a ? e.removeAttributeNS("http://www.w3.org/1999/xlink", t.toLowerCase()) : e.removeAttribute(t) : "function" != typeof r && (a ? e.setAttributeNS("http://www.w3.org/1999/xlink", t.toLowerCase(), r) : e.setAttribute(t, r));
            }
          } else e.className = r || "";
        }

        function d(e) {
          return this._listeners[e.type](E.event && E.event(e) || e);
        }

        var A = [],
            P = 0,
            j = !1,
            L = !1;

        function T() {
          for (var e; e = A.pop();) E.afterMount && E.afterMount(e), e.componentDidMount && e.componentDidMount();
        }

        function B(e, t, n, r, o, i) {
          P++ || (j = null != o && o.ownerSVGElement !== undefined, L = null != e && !("__preactattr_" in e));
          var u = D(e, t, n, r, i);
          return o && u.parentNode !== o && o.appendChild(u), --P || (L = !1, i || T()), u;
        }

        function D(e, t, n, r, o) {
          var i = e,
              u = j;
          if (null != t && "boolean" != typeof t || (t = ""), "string" == typeof t || "number" == typeof t) return e && e.splitText !== undefined && e.parentNode && (!e._component || o) ? e.nodeValue != t && (e.nodeValue = t) : (i = document.createTextNode(t), e && (e.parentNode && e.parentNode.replaceChild(i, e), F(e, !0))), i["__preactattr_"] = !0, i;
          var a = t.nodeName;
          if ("function" == typeof a) return function d(e, t, n, r) {
            var o = e && e._component,
                i = o,
                u = e,
                a = o && e._componentConstructor === t.nodeName,
                s = a,
                l = I(t);

            for (; o && !s && (o = o._parentComponent);) s = o.constructor === t.nodeName;

            o && s && (!r || o._component) ? (U(o, l, 3, n, r), e = o.base) : (i && !a && (q(i), e = u = null), o = R(t.nodeName, l, n), e && !o.nextBase && (o.nextBase = e, u = null), U(o, l, 1, n, r), e = o.base, u && e !== u && (u._component = null, F(u, !1)));
            return e;
          }(e, t, n, r);

          if (j = "svg" === a || "foreignObject" !== a && j, a = String(a), (!e || !N(e, a)) && (i = function h(e, t) {
            var n = t ? document.createElementNS("http://www.w3.org/2000/svg", e) : document.createElement(e);
            return n.normalizedNodeName = e, n;
          }(a, j), e)) {
            for (; e.firstChild;) i.appendChild(e.firstChild);

            e.parentNode && e.parentNode.replaceChild(i, e), F(e, !0);
          }

          var s = i.firstChild,
              l = i["__preactattr_"],
              c = t.children;

          if (null == l) {
            l = i["__preactattr_"] = {};

            for (var p = i.attributes, f = p.length; f--;) l[p[f].name] = p[f].value;
          }

          return !L && c && 1 === c.length && "string" == typeof c[0] && null != s && s.splitText !== undefined && null == s.nextSibling ? s.nodeValue != c[0] && (s.nodeValue = c[0]) : (c && c.length || null != s) && function S(e, t, n, r, o) {
            var i,
                u,
                a,
                s,
                l,
                c = e.childNodes,
                p = [],
                f = {},
                d = 0,
                h = 0,
                m = c.length,
                v = 0,
                y = t ? t.length : 0;
            if (0 !== m) for (var _ = 0; _ < m; _++) {
              var g = c[_],
                  b = g["__preactattr_"],
                  w = y && b ? g._component ? g._component.__key : b.key : null;
              null != w ? (d++, f[w] = g) : (b || (g.splitText !== undefined ? !o || g.nodeValue.trim() : o)) && (p[v++] = g);
            }
            if (0 !== y) for (var _ = 0; _ < y; _++) {
              s = t[_], l = null;
              var w = s.key;
              if (null != w) d && f[w] !== undefined && (l = f[w], f[w] = undefined, d--);else if (h < v) for (i = h; i < v; i++) if (p[i] !== undefined && (x = u = p[i], C = o, "string" == typeof (O = s) || "number" == typeof O ? x.splitText !== undefined : "string" == typeof O.nodeName ? !x._componentConstructor && N(x, O.nodeName) : C || x._componentConstructor === O.nodeName)) {
                l = u, p[i] = undefined, i === v - 1 && v--, i === h && h++;
                break;
              }
              l = D(l, s, n, r), a = c[_], l && l !== e && l !== a && (null == a ? e.appendChild(l) : l === a.nextSibling ? k(a) : e.insertBefore(l, a));
            }
            var x, O, C;
            if (d) for (var _ in f) f[_] !== undefined && F(f[_], !1);

            for (; h <= v;) (l = p[v--]) !== undefined && F(l, !1);
          }(i, c, n, r, L || null != l.dangerouslySetInnerHTML), function m(e, t, n) {
            var r;

            for (r in n) t && null != t[r] || null == n[r] || v(e, r, n[r], n[r] = undefined, j);

            for (r in t) "children" === r || "innerHTML" === r || r in n && t[r] === ("value" === r || "checked" === r ? e[r] : n[r]) || v(e, r, n[r], n[r] = t[r], j);
          }(i, t.attributes, l), j = u, i;
        }

        function F(e, t) {
          var n = e._component;
          n ? q(n) : (null != e["__preactattr_"] && e["__preactattr_"].ref && e["__preactattr_"].ref(null), !1 !== t && null != e["__preactattr_"] || k(e), h(e));
        }

        function h(e) {
          for (e = e.lastChild; e;) {
            var t = e.previousSibling;
            F(e, !0), e = t;
          }
        }

        var m = [];

        function R(e, t, n) {
          var r,
              o = m.length;

          for (e.prototype && e.prototype.render ? (r = new e(t, n), _.call(r, t, n)) : ((r = new _(t, n)).constructor = e, r.render = y); o--;) if (m[o].constructor === e) return r.nextBase = m[o].nextBase, m.splice(o, 1), r;

          return r;
        }

        function y(e, t, n) {
          return this.constructor(e, n);
        }

        function U(e, t, n, r, o) {
          e._disable || (e._disable = !0, e.__ref = t.ref, e.__key = t.key, delete t.ref, delete t.key, "undefined" == typeof e.constructor.getDerivedStateFromProps && (!e.base || o ? e.componentWillMount && e.componentWillMount() : e.componentWillReceiveProps && e.componentWillReceiveProps(t, r)), r && r !== e.context && (e.prevContext || (e.prevContext = e.context), e.context = r), e.prevProps || (e.prevProps = e.props), e.props = t, e._disable = !1, 0 !== n && (1 !== n && !1 === E.syncComponentUpdates && e.base ? a(e) : V(e, 1, o)), e.__ref && e.__ref(e));
        }

        function V(e, t, n, r) {
          if (!e._disable) {
            var o,
                i,
                u,
                a = e.props,
                s = e.state,
                l = e.context,
                c = e.prevProps || a,
                p = e.prevState || s,
                f = e.prevContext || l,
                d = e.base,
                h = e.nextBase,
                m = d || h,
                v = e._component,
                y = !1,
                _ = f;

            if (e.constructor.getDerivedStateFromProps && (s = M(M({}, s), e.constructor.getDerivedStateFromProps(a, s)), e.state = s), d && (e.props = c, e.state = p, e.context = f, 2 !== t && e.shouldComponentUpdate && !1 === e.shouldComponentUpdate(a, s, l) ? y = !0 : e.componentWillUpdate && e.componentWillUpdate(a, s, l), e.props = a, e.state = s, e.context = l), e.prevProps = e.prevState = e.prevContext = e.nextBase = null, e._dirty = !1, !y) {
              o = e.render(a, s, l), e.getChildContext && (l = M(M({}, l), e.getChildContext())), d && e.getSnapshotBeforeUpdate && (_ = e.getSnapshotBeforeUpdate(c, p));
              var g,
                  b,
                  w = o && o.nodeName;

              if ("function" == typeof w) {
                var x = I(o);
                (i = v) && i.constructor === w && x.key == i.__key ? U(i, x, 1, l, !1) : (g = i, e._component = i = R(w, x, l), i.nextBase = i.nextBase || h, i._parentComponent = e, U(i, x, 0, l, !1), V(i, 1, n, !0)), b = i.base;
              } else u = m, (g = v) && (u = e._component = null), (m || 1 === t) && (u && (u._component = null), b = function B(t, n, r, o, i, u) {
                P++ || (j = null != i && i.ownerSVGElement !== undefined, L = null != t && !("__preactattr_" in t));
                var a = D(t, n, r, o, u);
                return i && a.parentNode !== i && i.appendChild(a), --P || (L = !1, u || T()), a;
              }(u, o, l, n || !d, m && m.parentNode, !0));

              if (m && b !== m && i !== v) {
                var O = m.parentNode;
                O && b !== O && (O.replaceChild(b, m), g || (m._component = null, F(m, !1)));
              }

              if (g && q(g), (e.base = b) && !r) {
                for (var C = e, S = e; S = S._parentComponent;) (C = S).base = b;

                b._component = C, b._componentConstructor = C.constructor;
              }
            }

            for (!d || n ? A.unshift(e) : y || (e.componentDidUpdate && e.componentDidUpdate(c, p, _), E.afterUpdate && E.afterUpdate(e)); e._renderCallbacks.length;) e._renderCallbacks.pop().call(e);

            P || r || T();
          }
        }

        function q(e) {
          E.beforeUnmount && E.beforeUnmount(e);
          var t = e.base;
          e._disable = !0, e.componentWillUnmount && e.componentWillUnmount(), e.base = null;
          var n = e._component;
          n ? q(n) : t && (t["__preactattr_"] && t["__preactattr_"].ref && t["__preactattr_"].ref(null), k(e.nextBase = t), m.push(e), h(t)), e.__ref && e.__ref(null);
        }

        function _(e, t) {
          this._dirty = !0, this.context = t, this.props = e, this.state = this.state || {}, this._renderCallbacks = [];
        }

        function g(e, t, n) {
          return B(n, e, {}, !1, t, !1);
        }

        M(_.prototype, {
          setState: function (e, t) {
            this.prevState || (this.prevState = this.state), this.state = M(M({}, this.state), "function" == typeof e ? e(this.state, this.props) : e), t && this._renderCallbacks.push(t), a(this);
          },
          forceUpdate: function (e) {
            e && this._renderCallbacks.push(e), V(this, 2);
          },
          render: function g() {}
        });
        var b = {
          h: r,
          createElement: r,
          cloneElement: i,
          Component: _,
          render: g,
          rerender: f,
          options: E
        };
        t["default"] = b;
      }, function (e, t) {
        var n = e.exports = {
          version: "2.5.7"
        };
        "number" == typeof __e && (__e = n);
      }, function (e, t, n) {
        var r = n(8),
            o = n(40);
        e.exports = n(3) ? function (e, t, n) {
          return r.f(e, t, o(1, n));
        } : function (e, t, n) {
          return e[t] = n, e;
        };
      }, function (e, t, n) {
        var o = n(9),
            i = n(38),
            u = n(39),
            a = Object.defineProperty;
        t.f = n(3) ? Object.defineProperty : function (e, t, n) {
          if (o(e), t = u(t, !0), o(n), i) try {
            return a(e, t, n);
          } catch (r) {}
          if ("get" in n || "set" in n) throw TypeError("Accessors not supported!");
          return "value" in n && (e[t] = n.value), e;
        };
      }, function (e, t, n) {
        var r = n(2);

        e.exports = function (e) {
          if (!r(e)) throw TypeError(e + " is not an object!");
          return e;
        };
      }, function (e, t) {
        var n = 0,
            r = Math.random();

        e.exports = function (e) {
          return "Symbol(".concat(e === undefined ? "" : e, ")_", (++n + r).toString(36));
        };
      }, function (e, t, n) {
        var r = n(22);
        e.exports = Object("z").propertyIsEnumerable(0) ? Object : function (e) {
          return "String" == r(e) ? e.split("") : Object(e);
        };
      }, function (e, t) {
        e.exports = function (e) {
          if (e == undefined) throw TypeError("Can't call method on  " + e);
          return e;
        };
      }, function (e, t, n) {
        "use strict";

        var r = n(4);

        e.exports = function (e, t) {
          return !!e && r(function () {
            t ? e.call(null, function () {}, 1) : e.call(null);
          });
        };
      }, function (e, t, n) {
        var r = n(0);
        r(r.S + r.F, "Object", {
          assign: n(41)
        });
      }, function (e, t, n) {
        var r = n(2),
            o = n(1).document,
            i = r(o) && r(o.createElement);

        e.exports = function (e) {
          return i ? o.createElement(e) : {};
        };
      }, function (e, t, n) {
        var i = n(1),
            u = n(7),
            a = n(17),
            s = n(10)("src"),
            r = "toString",
            o = Function[r],
            l = ("" + o).split(r);
        n(6).inspectSource = function (e) {
          return o.call(e);
        }, (e.exports = function (e, t, n, r) {
          var o = "function" == typeof n;
          o && (a(n, "name") || u(n, "name", t)), e[t] !== n && (o && (a(n, s) || u(n, s, e[t] ? "" + e[t] : l.join(String(t)))), e === i ? e[t] = n : r ? e[t] ? e[t] = n : u(e, t, n) : (delete e[t], u(e, t, n)));
        })(Function.prototype, r, function () {
          return "function" == typeof this && this[s] || o.call(this);
        });
      }, function (e, t) {
        var n = {}.hasOwnProperty;

        e.exports = function (e, t) {
          return n.call(e, t);
        };
      }, function (e, t, n) {
        var i = n(19);

        e.exports = function (r, o, e) {
          if (i(r), o === undefined) return r;

          switch (e) {
            case 1:
              return function (e) {
                return r.call(o, e);
              };

            case 2:
              return function (e, t) {
                return r.call(o, e, t);
              };

            case 3:
              return function (e, t, n) {
                return r.call(o, e, t, n);
              };
          }

          return function () {
            return r.apply(o, arguments);
          };
        };
      }, function (e, t) {
        e.exports = function (e) {
          if ("function" != typeof e) throw TypeError(e + " is not a function!");
          return e;
        };
      }, function (e, t, n) {
        var r = n(42),
            o = n(28);

        e.exports = Object.keys || function (e) {
          return r(e, o);
        };
      }, function (e, t, n) {
        var r = n(11),
            o = n(12);

        e.exports = function (e) {
          return r(o(e));
        };
      }, function (e, t) {
        var n = {}.toString;

        e.exports = function (e) {
          return n.call(e).slice(8, -1);
        };
      }, function (e, t, n) {
        var s = n(21),
            l = n(24),
            c = n(43);

        e.exports = function (a) {
          return function (e, t, n) {
            var r,
                o = s(e),
                i = l(o.length),
                u = c(n, i);

            if (a && t != t) {
              for (; u < i;) if ((r = o[u++]) != r) return !0;
            } else for (; u < i; u++) if ((a || u in o) && o[u] === t) return a || u || 0;

            return !a && -1;
          };
        };
      }, function (e, t, n) {
        var r = n(25),
            o = Math.min;

        e.exports = function (e) {
          return 0 < e ? o(r(e), 9007199254740991) : 0;
        };
      }, function (e, t) {
        var n = Math.ceil,
            r = Math.floor;

        e.exports = function (e) {
          return isNaN(e = +e) ? 0 : (0 < e ? r : n)(e);
        };
      }, function (e, t, n) {
        var r = n(27)("keys"),
            o = n(10);

        e.exports = function (e) {
          return r[e] || (r[e] = o(e));
        };
      }, function (e, t, n) {
        var r = n(6),
            o = n(1),
            i = "__core-js_shared__",
            u = o[i] || (o[i] = {});
        (e.exports = function (e, t) {
          return u[e] || (u[e] = t !== undefined ? t : {});
        })("versions", []).push({
          version: r.version,
          mode: n(44) ? "pure" : "global",
          copyright: "© 2018 Denis Pushkarev (zloirock.ru)"
        });
      }, function (e, t) {
        e.exports = "constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",");
      }, function (e, t, n) {
        var r = n(12);

        e.exports = function (e) {
          return Object(r(e));
        };
      }, function (e, t, n) {
        var r = n(8).f,
            o = Function.prototype,
            i = /^\s*function ([^ (]*)/;
        "name" in o || n(3) && r(o, "name", {
          configurable: !0,
          get: function () {
            try {
              return ("" + this).match(i)[1];
            } catch (e) {
              return "";
            }
          }
        });
      }, function (e, t, n) {
        "use strict";

        var r = n(0),
            o = n(32)(1);
        r(r.P + r.F * !n(13)([].map, !0), "Array", {
          map: function (e) {
            return o(this, e, arguments[1]);
          }
        });
      }, function (e, t, n) {
        var g = n(18),
            b = n(11),
            w = n(29),
            x = n(24),
            r = n(47);

        e.exports = function (p, e) {
          var f = 1 == p,
              d = 2 == p,
              h = 3 == p,
              m = 4 == p,
              v = 6 == p,
              y = 5 == p || v,
              _ = e || r;

          return function (e, t, n) {
            for (var r, o, i = w(e), u = b(i), a = g(t, n, 3), s = x(u.length), l = 0, c = f ? _(e, s) : d ? _(e, 0) : undefined; l < s; l++) if ((y || l in u) && (o = a(r = u[l], l, i), p)) if (f) c[l] = o;else if (o) switch (p) {
              case 3:
                return !0;

              case 5:
                return r;

              case 6:
                return l;

              case 2:
                c.push(r);
            } else if (m) return !1;

            return v ? -1 : h || m ? m : c;
          };
        };
      }, function (e, t, n) {
        var r = n(22);

        e.exports = Array.isArray || function (e) {
          return "Array" == r(e);
        };
      }, function (e, t, n) {
        var r = n(27)("wks"),
            o = n(10),
            i = n(1).Symbol,
            u = "function" == typeof i;
        (e.exports = function (e) {
          return r[e] || (r[e] = u && i[e] || (u ? i : o)("Symbol." + e));
        }).store = r;
      }, function (e, t, n) {
        "use strict";

        var r = n(0),
            o = n(23)(!1),
            i = [].indexOf,
            u = !!i && 1 / [1].indexOf(1, -0) < 0;
        r(r.P + r.F * (u || !n(13)(i)), "Array", {
          indexOf: function (e) {
            return u ? i.apply(this, arguments) || 0 : o(this, e, arguments[1]);
          }
        });
      }, function (e, t, n) {
        var r = n(0);
        r(r.S, "Object", {
          create: n(52)
        });
      }, function (e, t, n) {
        "use strict";

        t.__esModule = !0, t["default"] = void 0, n(14), n(30), n(31), n(35), n(49), n(50);

        var r = n(5),
            o = function s(e) {
          return e && e.__esModule ? e : {
            "default": e
          };
        }(n(51));

        function i(e) {
          if (!e.element) throw new Error("element is not defined");
          if (!e.id) throw new Error("id is not defined");
          if (!e.source) throw new Error("source is not defined");
          Array.isArray(e.source) && (e.source = u(e.source)), (0, r.render)((0, r.createElement)(o["default"], e), e.element);
        }

        var u = function u(n) {
          return function (t, e) {
            e(n.filter(function (e) {
              return -1 !== e.toLowerCase().indexOf(t.toLowerCase());
            }));
          };
        };

        i.enhanceSelectElement = function (n) {
          if (!n.selectElement) throw new Error("selectElement is not defined");

          if (!n.source) {
            var e = [].filter.call(n.selectElement.options, function (e) {
              return e.value || n.preserveNullOptions;
            });
            n.source = e.map(function (e) {
              return e.textContent || e.innerText;
            });
          }

          if (n.onConfirm = n.onConfirm || function (t) {
            var e = [].filter.call(n.selectElement.options, function (e) {
              return (e.textContent || e.innerText) === t;
            })[0];
            e && (e.selected = !0);
          }, n.selectElement.value || n.defaultValue === undefined) {
            var t = n.selectElement.options[n.selectElement.options.selectedIndex];
            n.defaultValue = t.textContent || t.innerText;
          }

          n.name === undefined && (n.name = ""), n.id === undefined && (n.selectElement.id === undefined ? n.id = "" : n.id = n.selectElement.id), n.autoselect === undefined && (n.autoselect = !0);
          var r = document.createElement("div");
          n.selectElement.parentNode.insertBefore(r, n.selectElement), i(Object.assign({}, n, {
            element: r
          })), n.selectElement.style.display = "none", n.selectElement.id = n.selectElement.id + "-select";
        };

        var a = i;
        t["default"] = a;
      }, function (e, t, n) {
        e.exports = !n(3) && !n(4)(function () {
          return 7 != Object.defineProperty(n(15)("div"), "a", {
            get: function () {
              return 7;
            }
          }).a;
        });
      }, function (e, t, n) {
        var o = n(2);

        e.exports = function (e, t) {
          if (!o(e)) return e;
          var n, r;
          if (t && "function" == typeof (n = e.toString) && !o(r = n.call(e))) return r;
          if ("function" == typeof (n = e.valueOf) && !o(r = n.call(e))) return r;
          if (!t && "function" == typeof (n = e.toString) && !o(r = n.call(e))) return r;
          throw TypeError("Can't convert object to primitive value");
        };
      }, function (e, t) {
        e.exports = function (e, t) {
          return {
            enumerable: !(1 & e),
            configurable: !(2 & e),
            writable: !(4 & e),
            value: t
          };
        };
      }, function (e, t, n) {
        "use strict";

        var f = n(20),
            d = n(45),
            h = n(46),
            m = n(29),
            v = n(11),
            o = Object.assign;
        e.exports = !o || n(4)(function () {
          var e = {},
              t = {},
              n = Symbol(),
              r = "abcdefghijklmnopqrst";
          return e[n] = 7, r.split("").forEach(function (e) {
            t[e] = e;
          }), 7 != o({}, e)[n] || Object.keys(o({}, t)).join("") != r;
        }) ? function (e, t) {
          for (var n = m(e), r = arguments.length, o = 1, i = d.f, u = h.f; o < r;) for (var a, s = v(arguments[o++]), l = i ? f(s).concat(i(s)) : f(s), c = l.length, p = 0; p < c;) u.call(s, a = l[p++]) && (n[a] = s[a]);

          return n;
        } : o;
      }, function (e, t, n) {
        var u = n(17),
            a = n(21),
            s = n(23)(!1),
            l = n(26)("IE_PROTO");

        e.exports = function (e, t) {
          var n,
              r = a(e),
              o = 0,
              i = [];

          for (n in r) n != l && u(r, n) && i.push(n);

          for (; t.length > o;) u(r, n = t[o++]) && (~s(i, n) || i.push(n));

          return i;
        };
      }, function (e, t, n) {
        var r = n(25),
            o = Math.max,
            i = Math.min;

        e.exports = function (e, t) {
          return (e = r(e)) < 0 ? o(e + t, 0) : i(e, t);
        };
      }, function (e, t) {
        e.exports = !1;
      }, function (e, t) {
        t.f = Object.getOwnPropertySymbols;
      }, function (e, t) {
        t.f = {}.propertyIsEnumerable;
      }, function (e, t, n) {
        var r = n(48);

        e.exports = function (e, t) {
          return new (r(e))(t);
        };
      }, function (e, t, n) {
        var r = n(2),
            o = n(33),
            i = n(34)("species");

        e.exports = function (e) {
          var t;
          return o(e) && ("function" != typeof (t = e.constructor) || t !== Array && !o(t.prototype) || (t = undefined), r(t) && null === (t = t[i]) && (t = undefined)), t === undefined ? Array : t;
        };
      }, function (e, t, n) {
        "use strict";

        var r = n(0),
            o = n(32)(2);
        r(r.P + r.F * !n(13)([].filter, !0), "Array", {
          filter: function (e) {
            return o(this, e, arguments[1]);
          }
        });
      }, function (e, t, n) {
        var r = n(0);
        r(r.S, "Array", {
          isArray: n(33)
        });
      }, function (e, t, n) {
        "use strict";

        t.__esModule = !0, t["default"] = void 0, n(14), n(36), n(30), n(31), n(35), n(55), n(58);
        var $ = n(5),
            J = o(n(60)),
            r = o(n(61));

        function o(e) {
          return e && e.__esModule ? e : {
            "default": e
          };
        }

        function X() {
          return (X = Object.assign || function (e) {
            for (var t = 1; t < arguments.length; t++) {
              var n = arguments[t];

              for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
            }

            return e;
          }).apply(this, arguments);
        }

        function i(e) {
          if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
          return e;
        }

        var u = {
          13: "enter",
          27: "escape",
          32: "space",
          38: "up",
          40: "down"
        };

        function Y() {
          return !(!navigator.userAgent.match(/(iPod|iPhone|iPad)/g) || !navigator.userAgent.match(/AppleWebKit/g));
        }

        var a = function (n) {
          function e(e) {
            var t;
            return (t = n.call(this, e) || this).elementReferences = {}, t.state = {
              focused: null,
              hovered: null,
              menuOpen: !1,
              options: e.defaultValue ? [e.defaultValue] : [],
              query: e.defaultValue,
              validChoiceMade: !1,
              selected: null,
              ariaHint: !0
            }, t.handleComponentBlur = t.handleComponentBlur.bind(i(i(t))), t.handleKeyDown = t.handleKeyDown.bind(i(i(t))), t.handleUpArrow = t.handleUpArrow.bind(i(i(t))), t.handleDownArrow = t.handleDownArrow.bind(i(i(t))), t.handleEnter = t.handleEnter.bind(i(i(t))), t.handlePrintableKey = t.handlePrintableKey.bind(i(i(t))), t.handleListMouseLeave = t.handleListMouseLeave.bind(i(i(t))), t.handleOptionBlur = t.handleOptionBlur.bind(i(i(t))), t.handleOptionClick = t.handleOptionClick.bind(i(i(t))), t.handleOptionFocus = t.handleOptionFocus.bind(i(i(t))), t.handleOptionMouseDown = t.handleOptionMouseDown.bind(i(i(t))), t.handleOptionMouseEnter = t.handleOptionMouseEnter.bind(i(i(t))), t.handleInputBlur = t.handleInputBlur.bind(i(i(t))), t.handleInputChange = t.handleInputChange.bind(i(i(t))), t.handleInputFocus = t.handleInputFocus.bind(i(i(t))), t.pollInputElement = t.pollInputElement.bind(i(i(t))), t.getDirectInputChanges = t.getDirectInputChanges.bind(i(i(t))), t;
          }

          (function r(e, t) {
            e.prototype = Object.create(t.prototype), (e.prototype.constructor = e).__proto__ = t;
          })(e, n);

          var t = e.prototype;
          return t.isQueryAnOption = function (e, t) {
            var n = this;
            return -1 !== t.map(function (e) {
              return n.templateInputValue(e).toLowerCase();
            }).indexOf(e.toLowerCase());
          }, t.componentDidMount = function () {
            this.pollInputElement();
          }, t.componentWillUnmount = function () {
            clearTimeout(this.$pollInput);
          }, t.pollInputElement = function () {
            var e = this;
            this.getDirectInputChanges(), this.$pollInput = setTimeout(function () {
              e.pollInputElement();
            }, 100);
          }, t.getDirectInputChanges = function () {
            var e = this.elementReferences[-1];
            e && e.value !== this.state.query && this.handleInputChange({
              target: {
                value: e.value
              }
            });
          }, t.componentDidUpdate = function (e, t) {
            var n = this.state.focused,
                r = null === n,
                o = t.focused !== n;
            o && !r && this.elementReferences[n].focus();
            var i = -1 === n,
                u = o && null === t.focused;

            if (i && u) {
              var a = this.elementReferences[n];
              a.setSelectionRange(0, a.value.length);
            }
          }, t.hasAutoselect = function () {
            return !Y() && this.props.autoselect;
          }, t.templateInputValue = function (e) {
            var t = this.props.templates && this.props.templates.inputValue;
            return t ? t(e) : e;
          }, t.templateSuggestion = function (e) {
            var t = this.props.templates && this.props.templates.suggestion;
            return t ? t(e) : e;
          }, t.handleComponentBlur = function (e) {
            var t,
                n = this.state,
                r = n.options,
                o = n.query,
                i = n.selected;
            this.props.confirmOnBlur ? (t = e.query || o, this.props.onConfirm(r[i])) : t = o, this.setState({
              focused: null,
              menuOpen: e.menuOpen || !1,
              query: t,
              selected: null,
              validChoiceMade: this.isQueryAnOption(t, r)
            });
          }, t.handleListMouseLeave = function (e) {
            this.setState({
              hovered: null
            });
          }, t.handleOptionBlur = function (e, t) {
            var n = this.state,
                r = n.focused,
                o = n.menuOpen,
                i = n.options,
                u = n.selected,
                a = null === e.relatedTarget,
                s = e.relatedTarget === this.elementReferences[-1],
                l = r !== t && -1 !== r;

            if (!l && a || !(l || s)) {
              var c = o && Y();
              this.handleComponentBlur({
                menuOpen: c,
                query: this.templateInputValue(i[u])
              });
            }
          }, t.handleInputBlur = function (e) {
            var t = this.state,
                n = t.focused,
                r = t.menuOpen,
                o = t.options,
                i = t.query,
                u = t.selected;

            if (!(-1 !== n)) {
              var a = r && Y(),
                  s = Y() ? i : this.templateInputValue(o[u]);
              this.handleComponentBlur({
                menuOpen: a,
                query: s
              });
            }
          }, t.handleInputChange = function (e) {
            var n = this,
                t = this.props,
                r = t.minLength,
                o = t.source,
                i = t.showAllValues,
                u = this.hasAutoselect(),
                a = e.target.value,
                s = 0 === a.length,
                l = this.state.query.length !== a.length,
                c = a.length >= r;
            this.setState({
              query: a,
              ariaHint: s
            }), i || !s && l && c ? o(a, function (e) {
              var t = 0 < e.length;
              n.setState({
                menuOpen: t,
                options: e,
                selected: u && t ? 0 : -1,
                validChoiceMade: !1
              });
            }) : !s && c || this.setState({
              menuOpen: !1,
              options: []
            });
          }, t.handleInputClick = function (e) {
            this.handleInputChange(e);
          }, t.handleInputFocus = function (e) {
            var t = this.state,
                n = t.query,
                r = t.validChoiceMade,
                o = t.options,
                i = this.props.minLength,
                u = !r && n.length >= i && 0 < o.length;
            u ? this.setState(function (e) {
              var t = e.menuOpen;
              return {
                focused: -1,
                menuOpen: u || t,
                selected: -1
              };
            }) : this.setState({
              focused: -1
            });
          }, t.handleOptionFocus = function (e) {
            this.setState({
              focused: e,
              hovered: null,
              selected: e
            });
          }, t.handleOptionMouseEnter = function (e, t) {
            Y() || this.setState({
              hovered: t
            });
          }, t.handleOptionClick = function (e, t) {
            var n = this.state.options[t],
                r = this.templateInputValue(n);
            this.props.onConfirm(n), this.setState({
              focused: -1,
              hovered: null,
              menuOpen: !1,
              query: r,
              selected: -1,
              validChoiceMade: !0
            }), this.forceUpdate();
          }, t.handleOptionMouseDown = function (e) {
            e.preventDefault();
          }, t.handleUpArrow = function (e) {
            e.preventDefault();
            var t = this.state,
                n = t.menuOpen,
                r = t.selected;
            -1 !== r && n && this.handleOptionFocus(r - 1);
          }, t.handleDownArrow = function (e) {
            var t = this;
            if (e.preventDefault(), this.props.showAllValues && !1 === this.state.menuOpen) e.preventDefault(), this.props.source("", function (e) {
              t.setState({
                menuOpen: !0,
                options: e,
                selected: 0,
                focused: 0,
                hovered: null
              });
            });else if (!0 === this.state.menuOpen) {
              var n = this.state,
                  r = n.menuOpen,
                  o = n.options,
                  i = n.selected;
              i !== o.length - 1 && r && this.handleOptionFocus(i + 1);
            }
          }, t.handleSpace = function (e) {
            var t = this;
            this.props.showAllValues && !1 === this.state.menuOpen && "" === this.state.query && (e.preventDefault(), this.props.source("", function (e) {
              t.setState({
                menuOpen: !0,
                options: e
              });
            })), -1 !== this.state.focused && (e.preventDefault(), this.handleOptionClick(e, this.state.focused));
          }, t.handleEnter = function (e) {
            this.state.menuOpen && (e.preventDefault(), 0 <= this.state.selected && this.handleOptionClick(e, this.state.selected));
          }, t.handlePrintableKey = function (e) {
            var t = this.elementReferences[-1];
            e.target === t || t.focus();
          }, t.handleKeyDown = function (e) {
            switch (u[e.keyCode]) {
              case "up":
                this.handleUpArrow(e);
                break;

              case "down":
                this.handleDownArrow(e);
                break;

              case "space":
                this.handleSpace(e);
                break;

              case "enter":
                this.handleEnter(e);
                break;

              case "escape":
                this.handleComponentBlur({
                  query: this.state.query
                });
                break;

              default:
                (function t(e) {
                  return 47 < e && e < 58 || 32 === e || 8 === e || 64 < e && e < 91 || 95 < e && e < 112 || 185 < e && e < 193 || 218 < e && e < 223;
                })(e.keyCode) && this.handlePrintableKey(e);
            }
          }, t.render = function () {
            var e,
                i = this,
                t = this.props,
                n = t.cssNamespace,
                r = t.displayMenu,
                u = t.id,
                o = t.minLength,
                a = t.name,
                s = t.placeholder,
                l = t.required,
                c = t.showAllValues,
                p = t.tNoResults,
                f = t.tStatusQueryTooShort,
                d = t.tStatusNoResults,
                h = t.tStatusSelectedOption,
                m = t.tStatusResults,
                v = t.tAssistiveHint,
                y = t.dropdownArrow,
                _ = this.state,
                g = _.focused,
                b = _.hovered,
                w = _.menuOpen,
                x = _.options,
                O = _.query,
                C = _.selected,
                S = _.ariaHint,
                E = _.validChoiceMade,
                M = this.hasAutoselect(),
                N = -1 === g,
                I = 0 === x.length,
                k = 0 !== O.length,
                A = O.length >= o,
                P = this.props.showNoOptionsFound && N && I && k && A,
                j = n + "__wrapper",
                L = n + "__input",
                T = null !== g ? " " + L + "--focused" : "",
                B = this.props.showAllValues ? " " + L + "--show-all-values" : " " + L + "--default",
                D = n + "__dropdown-arrow-down",
                F = -1 !== g && null !== g,
                R = n + "__menu",
                U = R + "--" + r,
                V = R + "--" + (w || P ? "visible" : "hidden"),
                q = n + "__option",
                W = n + "__hint",
                H = this.templateInputValue(x[C]),
                K = H && 0 === H.toLowerCase().indexOf(O.toLowerCase()) && M ? O + H.substr(O.length) : "",
                Q = u + "__assistiveHint",
                z = S ? {
              "aria-describedby": Q
            } : null;
            return c && "string" == typeof (e = y({
              className: D
            })) && (e = (0, $.createElement)("div", {
              className: n + "__dropdown-arrow-down-wrapper",
              dangerouslySetInnerHTML: {
                __html: e
              }
            })), (0, $.createElement)("div", {
              className: j,
              onKeyDown: this.handleKeyDown
            }, (0, $.createElement)(J["default"], {
              id: u,
              length: x.length,
              queryLength: O.length,
              minQueryLength: o,
              selectedOption: this.templateInputValue(x[C]),
              selectedOptionIndex: C,
              validChoiceMade: E,
              isInFocus: null !== this.state.focused,
              tQueryTooShort: f,
              tNoResults: d,
              tSelectedOption: h,
              tResults: m
            }), K && (0, $.createElement)("span", null, (0, $.createElement)("input", {
              className: W,
              readonly: !0,
              tabIndex: "-1",
              value: K
            })), (0, $.createElement)("input", X({
              "aria-expanded": w ? "true" : "false",
              "aria-activedescendant": !!F && u + "__option--" + g,
              "aria-owns": u + "__listbox",
              "aria-autocomplete": this.hasAutoselect() ? "both" : "list"
            }, z, {
              autoComplete: "off",
              className: "" + L + T + B,
              id: u,
              onClick: function (e) {
                return i.handleInputClick(e);
              },
              onBlur: this.handleInputBlur
            }, function G(e) {
              return {
                onInput: e
              };
            }(this.handleInputChange), {
              onFocus: this.handleInputFocus,
              name: a,
              placeholder: s,
              ref: function (e) {
                i.elementReferences[-1] = e;
              },
              type: "text",
              role: "combobox",
              required: l,
              value: O
            })), e, (0, $.createElement)("ul", {
              className: R + " " + U + " " + V,
              onMouseLeave: function (e) {
                return i.handleListMouseLeave(e);
              },
              id: u + "__listbox",
              role: "listbox"
            }, x.map(function (e, t) {
              var n = (-1 === g ? C === t : g === t) && null === b ? " " + q + "--focused" : "",
                  r = t % 2 ? " " + q + "--odd" : "",
                  o = Y() ? "<span id=" + u + "__option-suffix--" + t + ' style="border:0;clip:rect(0 0 0 0);height:1px;marginBottom:-1px;marginRight:-1px;overflow:hidden;padding:0;position:absolute;whiteSpace:nowrap;width:1px"> ' + (t + 1) + " of " + x.length + "</span>" : "";
              return (0, $.createElement)("li", {
                "aria-selected": g === t ? "true" : "false",
                className: "" + q + n + r,
                dangerouslySetInnerHTML: {
                  __html: i.templateSuggestion(e) + o
                },
                id: u + "__option--" + t,
                key: t,
                onBlur: function (e) {
                  return i.handleOptionBlur(e, t);
                },
                onClick: function (e) {
                  return i.handleOptionClick(e, t);
                },
                onMouseDown: i.handleOptionMouseDown,
                onMouseEnter: function (e) {
                  return i.handleOptionMouseEnter(e, t);
                },
                ref: function (e) {
                  i.elementReferences[t] = e;
                },
                role: "option",
                tabIndex: "-1",
                "aria-posinset": t + 1,
                "aria-setsize": x.length
              });
            }), P && (0, $.createElement)("li", {
              className: q + " " + q + "--no-results"
            }, p())), (0, $.createElement)("span", {
              id: Q,
              style: {
                display: "none"
              }
            }, v()));
          }, e;
        }($.Component);

        (t["default"] = a).defaultProps = {
          autoselect: !1,
          cssNamespace: "autocomplete",
          defaultValue: "",
          displayMenu: "inline",
          minLength: 0,
          name: "input-autocomplete",
          placeholder: "",
          onConfirm: function () {},
          confirmOnBlur: !0,
          showNoOptionsFound: !0,
          showAllValues: !1,
          required: !1,
          tNoResults: function () {
            return "No results found";
          },
          tAssistiveHint: function () {
            return "When autocomplete results are available use up and down arrows to review and enter to select.  Touch device users, explore by touch or with swipe gestures.";
          },
          dropdownArrow: r["default"]
        };
      }, function (e, t, r) {
        var o = r(9),
            i = r(53),
            u = r(28),
            a = r(26)("IE_PROTO"),
            s = function () {},
            l = "prototype",
            c = function () {
          var e,
              t = r(15)("iframe"),
              n = u.length;

          for (t.style.display = "none", r(54).appendChild(t), t.src = "javascript:", (e = t.contentWindow.document).open(), e.write("<script>document.F=Object<\/script>"), e.close(), c = e.F; n--;) delete c[l][u[n]];

          return c();
        };

        e.exports = Object.create || function (e, t) {
          var n;
          return null !== e ? (s[l] = o(e), n = new s(), s[l] = null, n[a] = e) : n = c(), t === undefined ? n : i(n, t);
        };
      }, function (e, t, n) {
        var u = n(8),
            a = n(9),
            s = n(20);
        e.exports = n(3) ? Object.defineProperties : function (e, t) {
          a(e);

          for (var n, r = s(t), o = r.length, i = 0; i < o;) u.f(e, n = r[i++], t[n]);

          return e;
        };
      }, function (e, t, n) {
        var r = n(1).document;
        e.exports = r && r.documentElement;
      }, function (e, t, n) {
        var r = n(0);
        r(r.P, "Function", {
          bind: n(56)
        });
      }, function (e, t, n) {
        "use strict";

        var i = n(19),
            u = n(2),
            a = n(57),
            s = [].slice,
            l = {};

        e.exports = Function.bind || function (t) {
          var n = i(this),
              r = s.call(arguments, 1),
              o = function () {
            var e = r.concat(s.call(arguments));
            return this instanceof o ? function (e, t, n) {
              if (!(t in l)) {
                for (var r = [], o = 0; o < t; o++) r[o] = "a[" + o + "]";

                l[t] = Function("F,a", "return new F(" + r.join(",") + ")");
              }

              return l[t](e, n);
            }(n, e.length, e) : a(n, e, t);
          };

          return u(n.prototype) && (o.prototype = n.prototype), o;
        };
      }, function (e, t) {
        e.exports = function (e, t, n) {
          var r = n === undefined;

          switch (t.length) {
            case 0:
              return r ? e() : e.call(n);

            case 1:
              return r ? e(t[0]) : e.call(n, t[0]);

            case 2:
              return r ? e(t[0], t[1]) : e.call(n, t[0], t[1]);

            case 3:
              return r ? e(t[0], t[1], t[2]) : e.call(n, t[0], t[1], t[2]);

            case 4:
              return r ? e(t[0], t[1], t[2], t[3]) : e.call(n, t[0], t[1], t[2], t[3]);
          }

          return e.apply(n, t);
        };
      }, function (e, t, n) {
        n(59)("match", 1, function (r, o, e) {
          return [function (e) {
            "use strict";

            var t = r(this),
                n = e == undefined ? undefined : e[o];
            return n !== undefined ? n.call(e, t) : new RegExp(e)[o](String(t));
          }, e];
        });
      }, function (e, t, n) {
        "use strict";

        var a = n(7),
            s = n(16),
            l = n(4),
            c = n(12),
            p = n(34);

        e.exports = function (t, e, n) {
          var r = p(t),
              o = n(c, r, ""[t]),
              i = o[0],
              u = o[1];
          l(function () {
            var e = {};
            return e[r] = function () {
              return 7;
            }, 7 != ""[t](e);
          }) && (s(String.prototype, t, i), a(RegExp.prototype, r, 2 == e ? function (e, t) {
            return u.call(e, this, t);
          } : function (e) {
            return u.call(e, this);
          }));
        };
      }, function (e, t, n) {
        "use strict";

        t.__esModule = !0, t["default"] = void 0, n(36);
        var g = n(5);

        var r = function r(o, i, u) {
          var a;
          return function () {
            var e = this,
                t = arguments,
                n = function n() {
              a = null, u || o.apply(e, t);
            },
                r = u && !a;

            clearTimeout(a), a = setTimeout(n, i), r && o.apply(e, t);
          };
        },
            o = function (o) {
          function e() {
            for (var e, t = arguments.length, n = new Array(t), r = 0; r < t; r++) n[r] = arguments[r];

            return (e = o.call.apply(o, [this].concat(n)) || this).state = {
              bump: !1,
              debounced: !1
            }, e;
          }

          (function n(e, t) {
            e.prototype = Object.create(t.prototype), (e.prototype.constructor = e).__proto__ = t;
          })(e, o);

          var t = e.prototype;
          return t.componentWillMount = function () {
            var e = this;
            this.debounceStatusUpdate = r(function () {
              if (!e.state.debounced) {
                var t = !e.props.isInFocus || e.props.validChoiceMade;
                e.setState(function (e) {
                  return {
                    bump: !e.bump,
                    debounced: !0,
                    silenced: t
                  };
                });
              }
            }, 1400);
          }, t.componentWillReceiveProps = function (e) {
            e.queryLength;
            this.setState({
              debounced: !1
            });
          }, t.render = function () {
            var e = this.props,
                t = e.id,
                n = e.length,
                r = e.queryLength,
                o = e.minQueryLength,
                i = e.selectedOption,
                u = e.selectedOptionIndex,
                a = e.tQueryTooShort,
                s = e.tNoResults,
                l = e.tSelectedOption,
                c = e.tResults,
                p = this.state,
                f = p.bump,
                d = p.debounced,
                h = p.silenced,
                m = r < o,
                v = 0 === n,
                y = i ? l(i, n, u) : "",
                _ = null;
            return _ = m ? a(o) : v ? s() : c(n, y), this.debounceStatusUpdate(), (0, g.createElement)("div", {
              style: {
                border: "0",
                clip: "rect(0 0 0 0)",
                height: "1px",
                marginBottom: "-1px",
                marginRight: "-1px",
                overflow: "hidden",
                padding: "0",
                position: "absolute",
                whiteSpace: "nowrap",
                width: "1px"
              }
            }, (0, g.createElement)("div", {
              id: t + "__status--A",
              role: "status",
              "aria-atomic": "true",
              "aria-live": "polite"
            }, !h && d && f ? _ : ""), (0, g.createElement)("div", {
              id: t + "__status--B",
              role: "status",
              "aria-atomic": "true",
              "aria-live": "polite"
            }, h || !d || f ? "" : _));
          }, e;
        }(g.Component);

        (t["default"] = o).defaultProps = {
          tQueryTooShort: function (e) {
            return "Type in " + e + " or more characters for results";
          },
          tNoResults: function () {
            return "No search results";
          },
          tSelectedOption: function (e, t, n) {
            return e + " " + (n + 1) + " of " + t + " is highlighted";
          },
          tResults: function (e, t) {
            return e + " " + (1 === e ? "result" : "results") + " " + (1 === e ? "is" : "are") + " available. " + t;
          }
        };
      }, function (e, t, n) {
        "use strict";

        t.__esModule = !0, t["default"] = void 0;

        var r = n(5),
            o = function i(e) {
          var t = e.className;
          return (0, r.createElement)("svg", {
            version: "1.1",
            xmlns: "http://www.w3.org/2000/svg",
            className: t,
            focusable: "false"
          }, (0, r.createElement)("g", {
            stroke: "none",
            fill: "none",
            "fill-rule": "evenodd"
          }, (0, r.createElement)("polygon", {
            fill: "#000000",
            points: "0 0 22 0 11 17"
          })));
        };

        t["default"] = o;
      }])["default"];
    });
  }, {}],
  4: [function (require, module, exports) {
    (function (global) {
      (function (global, factory) {
        typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) : typeof define === 'function' && define.amd ? define('GOVUKFrontend', ['exports'], factory) : factory(global.GOVUKFrontend = {});
      })(this, function (exports) {
        'use strict';
        /**
         * TODO: Ideally this would be a NodeList.prototype.forEach polyfill
         * This seems to fail in IE8, requires more investigation.
         * See: https://github.com/imagitama/nodelist-foreach-polyfill
         */

        function nodeListForEach(nodes, callback) {
          if (window.NodeList.prototype.forEach) {
            return nodes.forEach(callback);
          }

          for (var i = 0; i < nodes.length; i++) {
            callback.call(window, nodes[i], i, nodes);
          }
        } // Used to generate a unique string, allows multiple instances of the component without
        // Them conflicting with each other.
        // https://stackoverflow.com/a/8809472


        function generateUniqueID() {
          var d = new Date().getTime();

          if (typeof window.performance !== 'undefined' && typeof window.performance.now === 'function') {
            d += window.performance.now(); // use high-precision timer if available
          }

          return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : r & 0x3 | 0x8).toString(16);
          });
        }

        (function (undefined) {
          // Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Object/defineProperty/detect.js
          var detect = // In IE8, defineProperty could only act on DOM elements, so full support
          // for the feature requires the ability to set a property on an arbitrary object
          'defineProperty' in Object && function () {
            try {
              var a = {};
              Object.defineProperty(a, 'test', {
                value: 42
              });
              return true;
            } catch (e) {
              return false;
            }
          }();

          if (detect) return; // Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Object.defineProperty&flags=always

          (function (nativeDefineProperty) {
            var supportsAccessors = Object.prototype.hasOwnProperty('__defineGetter__');
            var ERR_ACCESSORS_NOT_SUPPORTED = 'Getters & setters cannot be defined on this javascript engine';
            var ERR_VALUE_ACCESSORS = 'A property cannot both have accessors and be writable or have a value';

            Object.defineProperty = function defineProperty(object, property, descriptor) {
              // Where native support exists, assume it
              if (nativeDefineProperty && (object === window || object === document || object === Element.prototype || object instanceof Element)) {
                return nativeDefineProperty(object, property, descriptor);
              }

              if (object === null || !(object instanceof Object || typeof object === 'object')) {
                throw new TypeError('Object.defineProperty called on non-object');
              }

              if (!(descriptor instanceof Object)) {
                throw new TypeError('Property description must be an object');
              }

              var propertyString = String(property);
              var hasValueOrWritable = 'value' in descriptor || 'writable' in descriptor;
              var getterType = 'get' in descriptor && typeof descriptor.get;
              var setterType = 'set' in descriptor && typeof descriptor.set; // handle descriptor.get

              if (getterType) {
                if (getterType !== 'function') {
                  throw new TypeError('Getter must be a function');
                }

                if (!supportsAccessors) {
                  throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
                }

                if (hasValueOrWritable) {
                  throw new TypeError(ERR_VALUE_ACCESSORS);
                }

                Object.__defineGetter__.call(object, propertyString, descriptor.get);
              } else {
                object[propertyString] = descriptor.value;
              } // handle descriptor.set


              if (setterType) {
                if (setterType !== 'function') {
                  throw new TypeError('Setter must be a function');
                }

                if (!supportsAccessors) {
                  throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
                }

                if (hasValueOrWritable) {
                  throw new TypeError(ERR_VALUE_ACCESSORS);
                }

                Object.__defineSetter__.call(object, propertyString, descriptor.set);
              } // OK to define value unconditionally - if a getter has been specified as well, an error would be thrown above


              if ('value' in descriptor) {
                object[propertyString] = descriptor.value;
              }

              return object;
            };
          })(Object.defineProperty);
        }).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});
        (function (undefined) {
          // Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Function/prototype/bind/detect.js
          var detect = 'bind' in Function.prototype;
          if (detect) return; // Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Function.prototype.bind&flags=always

          Object.defineProperty(Function.prototype, 'bind', {
            value: function bind(that) {
              // .length is 1
              // add necessary es5-shim utilities
              var $Array = Array;
              var $Object = Object;
              var ObjectPrototype = $Object.prototype;
              var ArrayPrototype = $Array.prototype;

              var Empty = function Empty() {};

              var to_string = ObjectPrototype.toString;
              var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';
              var isCallable;
              /* inlined from https://npmjs.com/is-callable */

              var fnToStr = Function.prototype.toString,
                  tryFunctionObject = function tryFunctionObject(value) {
                try {
                  fnToStr.call(value);
                  return true;
                } catch (e) {
                  return false;
                }
              },
                  fnClass = '[object Function]',
                  genClass = '[object GeneratorFunction]';

              isCallable = function isCallable(value) {
                if (typeof value !== 'function') {
                  return false;
                }

                if (hasToStringTag) {
                  return tryFunctionObject(value);
                }

                var strClass = to_string.call(value);
                return strClass === fnClass || strClass === genClass;
              };

              var array_slice = ArrayPrototype.slice;
              var array_concat = ArrayPrototype.concat;
              var array_push = ArrayPrototype.push;
              var max = Math.max; // /add necessary es5-shim utilities
              // 1. Let Target be the this value.

              var target = this; // 2. If IsCallable(Target) is false, throw a TypeError exception.

              if (!isCallable(target)) {
                throw new TypeError('Function.prototype.bind called on incompatible ' + target);
              } // 3. Let A be a new (possibly empty) internal list of all of the
              //   argument values provided after thisArg (arg1, arg2 etc), in order.
              // XXX slicedArgs will stand in for "A" if used


              var args = array_slice.call(arguments, 1); // for normal call
              // 4. Let F be a new native ECMAScript object.
              // 11. Set the [[Prototype]] internal property of F to the standard
              //   built-in Function prototype object as specified in 15.3.3.1.
              // 12. Set the [[Call]] internal property of F as described in
              //   15.3.4.5.1.
              // 13. Set the [[Construct]] internal property of F as described in
              //   15.3.4.5.2.
              // 14. Set the [[HasInstance]] internal property of F as described in
              //   15.3.4.5.3.

              var bound;

              var binder = function () {
                if (this instanceof bound) {
                  // 15.3.4.5.2 [[Construct]]
                  // When the [[Construct]] internal method of a function object,
                  // F that was created using the bind function is called with a
                  // list of arguments ExtraArgs, the following steps are taken:
                  // 1. Let target be the value of F's [[TargetFunction]]
                  //   internal property.
                  // 2. If target has no [[Construct]] internal method, a
                  //   TypeError exception is thrown.
                  // 3. Let boundArgs be the value of F's [[BoundArgs]] internal
                  //   property.
                  // 4. Let args be a new list containing the same values as the
                  //   list boundArgs in the same order followed by the same
                  //   values as the list ExtraArgs in the same order.
                  // 5. Return the result of calling the [[Construct]] internal
                  //   method of target providing args as the arguments.
                  var result = target.apply(this, array_concat.call(args, array_slice.call(arguments)));

                  if ($Object(result) === result) {
                    return result;
                  }

                  return this;
                } else {
                  // 15.3.4.5.1 [[Call]]
                  // When the [[Call]] internal method of a function object, F,
                  // which was created using the bind function is called with a
                  // this value and a list of arguments ExtraArgs, the following
                  // steps are taken:
                  // 1. Let boundArgs be the value of F's [[BoundArgs]] internal
                  //   property.
                  // 2. Let boundThis be the value of F's [[BoundThis]] internal
                  //   property.
                  // 3. Let target be the value of F's [[TargetFunction]] internal
                  //   property.
                  // 4. Let args be a new list containing the same values as the
                  //   list boundArgs in the same order followed by the same
                  //   values as the list ExtraArgs in the same order.
                  // 5. Return the result of calling the [[Call]] internal method
                  //   of target providing boundThis as the this value and
                  //   providing args as the arguments.
                  // equiv: target.call(this, ...boundArgs, ...args)
                  return target.apply(that, array_concat.call(args, array_slice.call(arguments)));
                }
              }; // 15. If the [[Class]] internal property of Target is "Function", then
              //     a. Let L be the length property of Target minus the length of A.
              //     b. Set the length own property of F to either 0 or L, whichever is
              //       larger.
              // 16. Else set the length own property of F to 0.


              var boundLength = max(0, target.length - args.length); // 17. Set the attributes of the length own property of F to the values
              //   specified in 15.3.5.1.

              var boundArgs = [];

              for (var i = 0; i < boundLength; i++) {
                array_push.call(boundArgs, '$' + i);
              } // XXX Build a dynamic function with desired amount of arguments is the only
              // way to set the length property of a function.
              // In environments where Content Security Policies enabled (Chrome extensions,
              // for ex.) all use of eval or Function costructor throws an exception.
              // However in all of these environments Function.prototype.bind exists
              // and so this code will never be executed.


              bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this, arguments); }')(binder);

              if (target.prototype) {
                Empty.prototype = target.prototype;
                bound.prototype = new Empty(); // Clean up dangling references.

                Empty.prototype = null;
              } // TODO
              // 18. Set the [[Extensible]] internal property of F to true.
              // TODO
              // 19. Let thrower be the [[ThrowTypeError]] function Object (13.2.3).
              // 20. Call the [[DefineOwnProperty]] internal method of F with
              //   arguments "caller", PropertyDescriptor {[[Get]]: thrower, [[Set]]:
              //   thrower, [[Enumerable]]: false, [[Configurable]]: false}, and
              //   false.
              // 21. Call the [[DefineOwnProperty]] internal method of F with
              //   arguments "arguments", PropertyDescriptor {[[Get]]: thrower,
              //   [[Set]]: thrower, [[Enumerable]]: false, [[Configurable]]: false},
              //   and false.
              // TODO
              // NOTE Function objects created using Function.prototype.bind do not
              // have a prototype property or the [[Code]], [[FormalParameters]], and
              // [[Scope]] internal properties.
              // XXX can't delete prototype in pure-js.
              // 22. Return F.


              return bound;
            }
          });
        }).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});
        (function (undefined) {
          // Detection from https://raw.githubusercontent.com/Financial-Times/polyfill-service/master/packages/polyfill-library/polyfills/DOMTokenList/detect.js
          var detect = 'DOMTokenList' in this && function (x) {
            return 'classList' in x ? !x.classList.toggle('x', false) && !x.className : true;
          }(document.createElement('x'));

          if (detect) return; // Polyfill from https://raw.githubusercontent.com/Financial-Times/polyfill-service/master/packages/polyfill-library/polyfills/DOMTokenList/polyfill.js

          (function (global) {
            var nativeImpl = "DOMTokenList" in global && global.DOMTokenList;

            if (!nativeImpl || !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', 'svg') && !(document.createElementNS("http://www.w3.org/2000/svg", "svg").classList instanceof DOMTokenList)) {
              global.DOMTokenList = function () {
                // eslint-disable-line no-unused-vars
                var dpSupport = true;

                var defineGetter = function (object, name, fn, configurable) {
                  if (Object.defineProperty) Object.defineProperty(object, name, {
                    configurable: false === dpSupport ? true : !!configurable,
                    get: fn
                  });else object.__defineGetter__(name, fn);
                };
                /** Ensure the browser allows Object.defineProperty to be used on native JavaScript objects. */


                try {
                  defineGetter({}, "support");
                } catch (e) {
                  dpSupport = false;
                }

                var _DOMTokenList = function (el, prop) {
                  var that = this;
                  var tokens = [];
                  var tokenMap = {};
                  var length = 0;
                  var maxLength = 0;

                  var addIndexGetter = function (i) {
                    defineGetter(that, i, function () {
                      preop();
                      return tokens[i];
                    }, false);
                  };

                  var reindex = function () {
                    /** Define getter functions for array-like access to the tokenList's contents. */
                    if (length >= maxLength) for (; maxLength < length; ++maxLength) {
                      addIndexGetter(maxLength);
                    }
                  };
                  /** Helper function called at the start of each class method. Internal use only. */


                  var preop = function () {
                    var error;
                    var i;
                    var args = arguments;
                    var rSpace = /\s+/;
                    /** Validate the token/s passed to an instance method, if any. */

                    if (args.length) for (i = 0; i < args.length; ++i) if (rSpace.test(args[i])) {
                      error = new SyntaxError('String "' + args[i] + '" ' + "contains" + ' an invalid character');
                      error.code = 5;
                      error.name = "InvalidCharacterError";
                      throw error;
                    }
                    /** Split the new value apart by whitespace*/

                    if (typeof el[prop] === "object") {
                      tokens = ("" + el[prop].baseVal).replace(/^\s+|\s+$/g, "").split(rSpace);
                    } else {
                      tokens = ("" + el[prop]).replace(/^\s+|\s+$/g, "").split(rSpace);
                    }
                    /** Avoid treating blank strings as single-item token lists */


                    if ("" === tokens[0]) tokens = [];
                    /** Repopulate the internal token lists */

                    tokenMap = {};

                    for (i = 0; i < tokens.length; ++i) tokenMap[tokens[i]] = true;

                    length = tokens.length;
                    reindex();
                  };
                  /** Populate our internal token list if the targeted attribute of the subject element isn't empty. */


                  preop();
                  /** Return the number of tokens in the underlying string. Read-only. */

                  defineGetter(that, "length", function () {
                    preop();
                    return length;
                  });
                  /** Override the default toString/toLocaleString methods to return a space-delimited list of tokens when typecast. */

                  that.toLocaleString = that.toString = function () {
                    preop();
                    return tokens.join(" ");
                  };

                  that.item = function (idx) {
                    preop();
                    return tokens[idx];
                  };

                  that.contains = function (token) {
                    preop();
                    return !!tokenMap[token];
                  };

                  that.add = function () {
                    preop.apply(that, args = arguments);

                    for (var args, token, i = 0, l = args.length; i < l; ++i) {
                      token = args[i];

                      if (!tokenMap[token]) {
                        tokens.push(token);
                        tokenMap[token] = true;
                      }
                    }
                    /** Update the targeted attribute of the attached element if the token list's changed. */


                    if (length !== tokens.length) {
                      length = tokens.length >>> 0;

                      if (typeof el[prop] === "object") {
                        el[prop].baseVal = tokens.join(" ");
                      } else {
                        el[prop] = tokens.join(" ");
                      }

                      reindex();
                    }
                  };

                  that.remove = function () {
                    preop.apply(that, args = arguments);
                    /** Build a hash of token names to compare against when recollecting our token list. */

                    for (var args, ignore = {}, i = 0, t = []; i < args.length; ++i) {
                      ignore[args[i]] = true;
                      delete tokenMap[args[i]];
                    }
                    /** Run through our tokens list and reassign only those that aren't defined in the hash declared above. */


                    for (i = 0; i < tokens.length; ++i) if (!ignore[tokens[i]]) t.push(tokens[i]);

                    tokens = t;
                    length = t.length >>> 0;
                    /** Update the targeted attribute of the attached element. */

                    if (typeof el[prop] === "object") {
                      el[prop].baseVal = tokens.join(" ");
                    } else {
                      el[prop] = tokens.join(" ");
                    }

                    reindex();
                  };

                  that.toggle = function (token, force) {
                    preop.apply(that, [token]);
                    /** Token state's being forced. */

                    if (undefined !== force) {
                      if (force) {
                        that.add(token);
                        return true;
                      } else {
                        that.remove(token);
                        return false;
                      }
                    }
                    /** Token already exists in tokenList. Remove it, and return FALSE. */


                    if (tokenMap[token]) {
                      that.remove(token);
                      return false;
                    }
                    /** Otherwise, add the token and return TRUE. */


                    that.add(token);
                    return true;
                  };

                  return that;
                };

                return _DOMTokenList;
              }();
            } // Add second argument to native DOMTokenList.toggle() if necessary


            (function () {
              var e = document.createElement('span');
              if (!('classList' in e)) return;
              e.classList.toggle('x', false);
              if (!e.classList.contains('x')) return;

              e.classList.constructor.prototype.toggle = function toggle(token
              /*, force*/
              ) {
                var force = arguments[1];

                if (force === undefined) {
                  var add = !this.contains(token);
                  this[add ? 'add' : 'remove'](token);
                  return add;
                }

                force = !!force;
                this[force ? 'add' : 'remove'](token);
                return force;
              };
            })(); // Add multiple arguments to native DOMTokenList.add() if necessary


            (function () {
              var e = document.createElement('span');
              if (!('classList' in e)) return;
              e.classList.add('a', 'b');
              if (e.classList.contains('b')) return;
              var native = e.classList.constructor.prototype.add;

              e.classList.constructor.prototype.add = function () {
                var args = arguments;
                var l = arguments.length;

                for (var i = 0; i < l; i++) {
                  native.call(this, args[i]);
                }
              };
            })(); // Add multiple arguments to native DOMTokenList.remove() if necessary


            (function () {
              var e = document.createElement('span');
              if (!('classList' in e)) return;
              e.classList.add('a');
              e.classList.add('b');
              e.classList.remove('a', 'b');
              if (!e.classList.contains('b')) return;
              var native = e.classList.constructor.prototype.remove;

              e.classList.constructor.prototype.remove = function () {
                var args = arguments;
                var l = arguments.length;

                for (var i = 0; i < l; i++) {
                  native.call(this, args[i]);
                }
              };
            })();
          })(this);
        }).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});
        (function (undefined) {
          // Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Document/detect.js
          var detect = "Document" in this;
          if (detect) return; // Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Document&flags=always

          if (typeof WorkerGlobalScope === "undefined" && typeof importScripts !== "function") {
            if (this.HTMLDocument) {
              // IE8
              // HTMLDocument is an extension of Document.  If the browser has HTMLDocument but not Document, the former will suffice as an alias for the latter.
              this.Document = this.HTMLDocument;
            } else {
              // Create an empty function to act as the missing constructor for the document object, attach the document object as its prototype.  The function needs to be anonymous else it is hoisted and causes the feature detect to prematurely pass, preventing the assignments below being made.
              this.Document = this.HTMLDocument = document.constructor = new Function('return function Document() {}')();
              this.Document.prototype = document;
            }
          }
        }).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});
        (function (undefined) {
          // Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Element/detect.js
          var detect = 'Element' in this && 'HTMLElement' in this;
          if (detect) return; // Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Element&flags=always

          (function () {
            // IE8
            if (window.Element && !window.HTMLElement) {
              window.HTMLElement = window.Element;
              return;
            } // create Element constructor


            window.Element = window.HTMLElement = new Function('return function Element() {}')(); // generate sandboxed iframe

            var vbody = document.appendChild(document.createElement('body'));
            var frame = vbody.appendChild(document.createElement('iframe')); // use sandboxed iframe to replicate Element functionality

            var frameDocument = frame.contentWindow.document;
            var prototype = Element.prototype = frameDocument.appendChild(frameDocument.createElement('*'));
            var cache = {}; // polyfill Element.prototype on an element

            var shiv = function (element, deep) {
              var childNodes = element.childNodes || [],
                  index = -1,
                  key,
                  value,
                  childNode;

              if (element.nodeType === 1 && element.constructor !== Element) {
                element.constructor = Element;

                for (key in cache) {
                  value = cache[key];
                  element[key] = value;
                }
              }

              while (childNode = deep && childNodes[++index]) {
                shiv(childNode, deep);
              }

              return element;
            };

            var elements = document.getElementsByTagName('*');
            var nativeCreateElement = document.createElement;
            var interval;
            var loopLimit = 100;
            prototype.attachEvent('onpropertychange', function (event) {
              var propertyName = event.propertyName,
                  nonValue = !cache.hasOwnProperty(propertyName),
                  newValue = prototype[propertyName],
                  oldValue = cache[propertyName],
                  index = -1,
                  element;

              while (element = elements[++index]) {
                if (element.nodeType === 1) {
                  if (nonValue || element[propertyName] === oldValue) {
                    element[propertyName] = newValue;
                  }
                }
              }

              cache[propertyName] = newValue;
            });
            prototype.constructor = Element;

            if (!prototype.hasAttribute) {
              // <Element>.hasAttribute
              prototype.hasAttribute = function hasAttribute(name) {
                return this.getAttribute(name) !== null;
              };
            } // Apply Element prototype to the pre-existing DOM as soon as the body element appears.


            function bodyCheck() {
              if (!loopLimit--) clearTimeout(interval);

              if (document.body && !document.body.prototype && /(complete|interactive)/.test(document.readyState)) {
                shiv(document, true);
                if (interval && document.body.prototype) clearTimeout(interval);
                return !!document.body.prototype;
              }

              return false;
            }

            if (!bodyCheck()) {
              document.onreadystatechange = bodyCheck;
              interval = setInterval(bodyCheck, 25);
            } // Apply to any new elements created after load


            document.createElement = function createElement(nodeName) {
              var element = nativeCreateElement(String(nodeName).toLowerCase());
              return shiv(element);
            }; // remove sandboxed iframe


            document.removeChild(vbody);
          })();
        }).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});
        (function (undefined) {
          // Detection from https://raw.githubusercontent.com/Financial-Times/polyfill-service/8717a9e04ac7aff99b4980fbedead98036b0929a/packages/polyfill-library/polyfills/Element/prototype/classList/detect.js
          var detect = 'document' in this && "classList" in document.documentElement && 'Element' in this && 'classList' in Element.prototype && function () {
            var e = document.createElement('span');
            e.classList.add('a', 'b');
            return e.classList.contains('b');
          }();

          if (detect) return; // Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Element.prototype.classList&flags=always

          (function (global) {
            var dpSupport = true;

            var defineGetter = function (object, name, fn, configurable) {
              if (Object.defineProperty) Object.defineProperty(object, name, {
                configurable: false === dpSupport ? true : !!configurable,
                get: fn
              });else object.__defineGetter__(name, fn);
            };
            /** Ensure the browser allows Object.defineProperty to be used on native JavaScript objects. */


            try {
              defineGetter({}, "support");
            } catch (e) {
              dpSupport = false;
            }
            /** Polyfills a property with a DOMTokenList */


            var addProp = function (o, name, attr) {
              defineGetter(o.prototype, name, function () {
                var tokenList;
                var THIS = this,

                /** Prevent this from firing twice for some reason. What the hell, IE. */
                gibberishProperty = "__defineGetter__" + "DEFINE_PROPERTY" + name;
                if (THIS[gibberishProperty]) return tokenList;
                THIS[gibberishProperty] = true;
                /**
                 * IE8 can't define properties on native JavaScript objects, so we'll use a dumb hack instead.
                 *
                 * What this is doing is creating a dummy element ("reflection") inside a detached phantom node ("mirror")
                 * that serves as the target of Object.defineProperty instead. While we could simply use the subject HTML
                 * element instead, this would conflict with element types which use indexed properties (such as forms and
                 * select lists).
                 */

                if (false === dpSupport) {
                  var visage;
                  var mirror = addProp.mirror || document.createElement("div");
                  var reflections = mirror.childNodes;
                  var l = reflections.length;

                  for (var i = 0; i < l; ++i) if (reflections[i]._R === THIS) {
                    visage = reflections[i];
                    break;
                  }
                  /** Couldn't find an element's reflection inside the mirror. Materialise one. */


                  visage || (visage = mirror.appendChild(document.createElement("div")));
                  tokenList = DOMTokenList.call(visage, THIS, attr);
                } else tokenList = new DOMTokenList(THIS, attr);

                defineGetter(THIS, name, function () {
                  return tokenList;
                });
                delete THIS[gibberishProperty];
                return tokenList;
              }, true);
            };

            addProp(global.Element, "classList", "className");
            addProp(global.HTMLElement, "classList", "className");
            addProp(global.HTMLLinkElement, "relList", "rel");
            addProp(global.HTMLAnchorElement, "relList", "rel");
            addProp(global.HTMLAreaElement, "relList", "rel");
          })(this);
        }).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

        function Accordion($module) {
          this.$module = $module;
          this.moduleId = $module.getAttribute('id');
          this.$sections = $module.querySelectorAll('.govuk-accordion__section');
          this.$openAllButton = '';
          this.browserSupportsSessionStorage = helper.checkForSessionStorage();
          this.controlsClass = 'govuk-accordion__controls';
          this.openAllClass = 'govuk-accordion__open-all';
          this.iconClass = 'govuk-accordion__icon';
          this.sectionHeaderClass = 'govuk-accordion__section-header';
          this.sectionHeaderFocusedClass = 'govuk-accordion__section-header--focused';
          this.sectionHeadingClass = 'govuk-accordion__section-heading';
          this.sectionSummaryClass = 'govuk-accordion__section-summary';
          this.sectionButtonClass = 'govuk-accordion__section-button';
          this.sectionExpandedClass = 'govuk-accordion__section--expanded';
        } // Initialize component


        Accordion.prototype.init = function () {
          // Check for module
          if (!this.$module) {
            return;
          }

          this.initControls();
          this.initSectionHeaders(); // See if "Open all" button text should be updated

          var areAllSectionsOpen = this.checkIfAllSectionsOpen();
          this.updateOpenAllButton(areAllSectionsOpen);
        }; // Initialise controls and set attributes


        Accordion.prototype.initControls = function () {
          // Create "Open all" button and set attributes
          this.$openAllButton = document.createElement('button');
          this.$openAllButton.setAttribute('type', 'button');
          this.$openAllButton.innerHTML = 'Open all <span class="govuk-visually-hidden">sections</span>';
          this.$openAllButton.setAttribute('class', this.openAllClass);
          this.$openAllButton.setAttribute('aria-expanded', 'false');
          this.$openAllButton.setAttribute('type', 'button'); // Create control wrapper and add controls to it

          var accordionControls = document.createElement('div');
          accordionControls.setAttribute('class', this.controlsClass);
          accordionControls.appendChild(this.$openAllButton);
          this.$module.insertBefore(accordionControls, this.$module.firstChild); // Handle events for the controls

          this.$openAllButton.addEventListener('click', this.onOpenOrCloseAllToggle.bind(this));
        }; // Initialise section headers


        Accordion.prototype.initSectionHeaders = function () {
          // Loop through section headers
          nodeListForEach(this.$sections, function ($section, i) {
            // Set header attributes
            var header = $section.querySelector('.' + this.sectionHeaderClass);
            this.initHeaderAttributes(header, i);
            this.setExpanded(this.isExpanded($section), $section); // Handle events

            header.addEventListener('click', this.onSectionToggle.bind(this, $section)); // See if there is any state stored in sessionStorage and set the sections to
            // open or closed.

            this.setInitialState($section);
          }.bind(this));
        }; // Set individual header attributes


        Accordion.prototype.initHeaderAttributes = function ($headerWrapper, index) {
          var $module = this;
          var $span = $headerWrapper.querySelector('.' + this.sectionButtonClass);
          var $heading = $headerWrapper.querySelector('.' + this.sectionHeadingClass);
          var $summary = $headerWrapper.querySelector('.' + this.sectionSummaryClass); // Copy existing span element to an actual button element, for improved accessibility.

          var $button = document.createElement('button');
          $button.setAttribute('type', 'button');
          $button.setAttribute('id', this.moduleId + '-heading-' + (index + 1));
          $button.setAttribute('aria-controls', this.moduleId + '-content-' + (index + 1)); // Copy all attributes (https://developer.mozilla.org/en-US/docs/Web/API/Element/attributes) from $span to $button

          for (var i = 0; i < $span.attributes.length; i++) {
            var attr = $span.attributes.item(i);
            $button.setAttribute(attr.nodeName, attr.nodeValue);
          }

          $button.addEventListener('focusin', function (e) {
            if (!$headerWrapper.classList.contains($module.sectionHeaderFocusedClass)) {
              $headerWrapper.className += ' ' + $module.sectionHeaderFocusedClass;
            }
          });
          $button.addEventListener('blur', function (e) {
            $headerWrapper.classList.remove($module.sectionHeaderFocusedClass);
          });

          if (typeof $summary !== 'undefined' && $summary !== null) {
            $button.setAttribute('aria-describedby', this.moduleId + '-summary-' + (index + 1));
          } // $span could contain HTML elements (see https://www.w3.org/TR/2011/WD-html5-20110525/content-models.html#phrasing-content)


          $button.innerHTML = $span.innerHTML;
          $heading.removeChild($span);
          $heading.appendChild($button); // Add "+/-" icon

          var icon = document.createElement('span');
          icon.className = this.iconClass;
          icon.setAttribute('aria-hidden', 'true');
          $heading.appendChild(icon);
        }; // When section toggled, set and store state


        Accordion.prototype.onSectionToggle = function ($section) {
          var expanded = this.isExpanded($section);
          this.setExpanded(!expanded, $section); // Store the state in sessionStorage when a change is triggered

          this.storeState($section);
        }; // When Open/Close All toggled, set and store state


        Accordion.prototype.onOpenOrCloseAllToggle = function () {
          var $module = this;
          var $sections = this.$sections;
          var nowExpanded = !this.checkIfAllSectionsOpen();
          nodeListForEach($sections, function ($section) {
            $module.setExpanded(nowExpanded, $section); // Store the state in sessionStorage when a change is triggered

            $module.storeState($section);
          });
          $module.updateOpenAllButton(nowExpanded);
        }; // Set section attributes when opened/closed


        Accordion.prototype.setExpanded = function (expanded, $section) {
          var $button = $section.querySelector('.' + this.sectionButtonClass);
          $button.setAttribute('aria-expanded', expanded);

          if (expanded) {
            $section.classList.add(this.sectionExpandedClass);
          } else {
            $section.classList.remove(this.sectionExpandedClass);
          } // See if "Open all" button text should be updated


          var areAllSectionsOpen = this.checkIfAllSectionsOpen();
          this.updateOpenAllButton(areAllSectionsOpen);
        }; // Get state of section


        Accordion.prototype.isExpanded = function ($section) {
          return $section.classList.contains(this.sectionExpandedClass);
        }; // Check if all sections are open


        Accordion.prototype.checkIfAllSectionsOpen = function () {
          // Get a count of all the Accordion sections
          var sectionsCount = this.$sections.length; // Get a count of all Accordion sections that are expanded

          var expandedSectionCount = this.$module.querySelectorAll('.' + this.sectionExpandedClass).length;
          var areAllSectionsOpen = sectionsCount === expandedSectionCount;
          return areAllSectionsOpen;
        }; // Update "Open all" button


        Accordion.prototype.updateOpenAllButton = function (expanded) {
          var newButtonText = expanded ? 'Close all' : 'Open all';
          newButtonText += '<span class="govuk-visually-hidden"> sections</span>';
          this.$openAllButton.setAttribute('aria-expanded', expanded);
          this.$openAllButton.innerHTML = newButtonText;
        }; // Check for `window.sessionStorage`, and that it actually works.


        var helper = {
          checkForSessionStorage: function () {
            var testString = 'this is the test string';
            var result;

            try {
              window.sessionStorage.setItem(testString, testString);
              result = window.sessionStorage.getItem(testString) === testString.toString();
              window.sessionStorage.removeItem(testString);
              return result;
            } catch (exception) {
              if (typeof console === 'undefined' || typeof console.log === 'undefined') {
                console.log('Notice: sessionStorage not available.');
              }
            }
          }
        }; // Set the state of the accordions in sessionStorage

        Accordion.prototype.storeState = function ($section) {
          if (this.browserSupportsSessionStorage) {
            // We need a unique way of identifying each content in the accordion. Since
            // an `#id` should be unique and an `id` is required for `aria-` attributes
            // `id` can be safely used.
            var $button = $section.querySelector('.' + this.sectionButtonClass);

            if ($button) {
              var contentId = $button.getAttribute('aria-controls');
              var contentState = $button.getAttribute('aria-expanded');

              if (typeof contentId === 'undefined' && (typeof console === 'undefined' || typeof console.log === 'undefined')) {
                console.error(new Error('No aria controls present in accordion section heading.'));
              }

              if (typeof contentState === 'undefined' && (typeof console === 'undefined' || typeof console.log === 'undefined')) {
                console.error(new Error('No aria expanded present in accordion section heading.'));
              } // Only set the state when both `contentId` and `contentState` are taken from the DOM.


              if (contentId && contentState) {
                window.sessionStorage.setItem(contentId, contentState);
              }
            }
          }
        }; // Read the state of the accordions from sessionStorage


        Accordion.prototype.setInitialState = function ($section) {
          if (this.browserSupportsSessionStorage) {
            var $button = $section.querySelector('.' + this.sectionButtonClass);

            if ($button) {
              var contentId = $button.getAttribute('aria-controls');
              var contentState = contentId ? window.sessionStorage.getItem(contentId) : null;

              if (contentState !== null) {
                this.setExpanded(contentState === 'true', $section);
              }
            }
          }
        };

        (function (undefined) {
          // Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Window/detect.js
          var detect = 'Window' in this;
          if (detect) return; // Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Window&flags=always

          if (typeof WorkerGlobalScope === "undefined" && typeof importScripts !== "function") {
            (function (global) {
              if (global.constructor) {
                global.Window = global.constructor;
              } else {
                (global.Window = global.constructor = new Function('return function Window() {}')()).prototype = this;
              }
            })(this);
          }
        }).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});
        (function (undefined) {
          // Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Event/detect.js
          var detect = function (global) {
            if (!('Event' in global)) return false;
            if (typeof global.Event === 'function') return true;

            try {
              // In IE 9-11, the Event object exists but cannot be instantiated
              new Event('click');
              return true;
            } catch (e) {
              return false;
            }
          }(this);

          if (detect) return; // Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Event&flags=always

          (function () {
            var unlistenableWindowEvents = {
              click: 1,
              dblclick: 1,
              keyup: 1,
              keypress: 1,
              keydown: 1,
              mousedown: 1,
              mouseup: 1,
              mousemove: 1,
              mouseover: 1,
              mouseenter: 1,
              mouseleave: 1,
              mouseout: 1,
              storage: 1,
              storagecommit: 1,
              textinput: 1
            }; // This polyfill depends on availability of `document` so will not run in a worker
            // However, we asssume there are no browsers with worker support that lack proper
            // support for `Event` within the worker

            if (typeof document === 'undefined' || typeof window === 'undefined') return;

            function indexOf(array, element) {
              var index = -1,
                  length = array.length;

              while (++index < length) {
                if (index in array && array[index] === element) {
                  return index;
                }
              }

              return -1;
            }

            var existingProto = window.Event && window.Event.prototype || null;

            window.Event = Window.prototype.Event = function Event(type, eventInitDict) {
              if (!type) {
                throw new Error('Not enough arguments');
              }

              var event; // Shortcut if browser supports createEvent

              if ('createEvent' in document) {
                event = document.createEvent('Event');
                var bubbles = eventInitDict && eventInitDict.bubbles !== undefined ? eventInitDict.bubbles : false;
                var cancelable = eventInitDict && eventInitDict.cancelable !== undefined ? eventInitDict.cancelable : false;
                event.initEvent(type, bubbles, cancelable);
                return event;
              }

              event = document.createEventObject();
              event.type = type;
              event.bubbles = eventInitDict && eventInitDict.bubbles !== undefined ? eventInitDict.bubbles : false;
              event.cancelable = eventInitDict && eventInitDict.cancelable !== undefined ? eventInitDict.cancelable : false;
              return event;
            };

            if (existingProto) {
              Object.defineProperty(window.Event, 'prototype', {
                configurable: false,
                enumerable: false,
                writable: true,
                value: existingProto
              });
            }

            if (!('createEvent' in document)) {
              window.addEventListener = Window.prototype.addEventListener = Document.prototype.addEventListener = Element.prototype.addEventListener = function addEventListener() {
                var element = this,
                    type = arguments[0],
                    listener = arguments[1];

                if (element === window && type in unlistenableWindowEvents) {
                  throw new Error('In IE8 the event: ' + type + ' is not available on the window object. Please see https://github.com/Financial-Times/polyfill-service/issues/317 for more information.');
                }

                if (!element._events) {
                  element._events = {};
                }

                if (!element._events[type]) {
                  element._events[type] = function (event) {
                    var list = element._events[event.type].list,
                        events = list.slice(),
                        index = -1,
                        length = events.length,
                        eventElement;

                    event.preventDefault = function preventDefault() {
                      if (event.cancelable !== false) {
                        event.returnValue = false;
                      }
                    };

                    event.stopPropagation = function stopPropagation() {
                      event.cancelBubble = true;
                    };

                    event.stopImmediatePropagation = function stopImmediatePropagation() {
                      event.cancelBubble = true;
                      event.cancelImmediate = true;
                    };

                    event.currentTarget = element;
                    event.relatedTarget = event.fromElement || null;
                    event.target = event.target || event.srcElement || element;
                    event.timeStamp = new Date().getTime();

                    if (event.clientX) {
                      event.pageX = event.clientX + document.documentElement.scrollLeft;
                      event.pageY = event.clientY + document.documentElement.scrollTop;
                    }

                    while (++index < length && !event.cancelImmediate) {
                      if (index in events) {
                        eventElement = events[index];

                        if (indexOf(list, eventElement) !== -1 && typeof eventElement === 'function') {
                          eventElement.call(element, event);
                        }
                      }
                    }
                  };

                  element._events[type].list = [];

                  if (element.attachEvent) {
                    element.attachEvent('on' + type, element._events[type]);
                  }
                }

                element._events[type].list.push(listener);
              };

              window.removeEventListener = Window.prototype.removeEventListener = Document.prototype.removeEventListener = Element.prototype.removeEventListener = function removeEventListener() {
                var element = this,
                    type = arguments[0],
                    listener = arguments[1],
                    index;

                if (element._events && element._events[type] && element._events[type].list) {
                  index = indexOf(element._events[type].list, listener);

                  if (index !== -1) {
                    element._events[type].list.splice(index, 1);

                    if (!element._events[type].list.length) {
                      if (element.detachEvent) {
                        element.detachEvent('on' + type, element._events[type]);
                      }

                      delete element._events[type];
                    }
                  }
                }
              };

              window.dispatchEvent = Window.prototype.dispatchEvent = Document.prototype.dispatchEvent = Element.prototype.dispatchEvent = function dispatchEvent(event) {
                if (!arguments.length) {
                  throw new Error('Not enough arguments');
                }

                if (!event || typeof event.type !== 'string') {
                  throw new Error('DOM Events Exception 0');
                }

                var element = this,
                    type = event.type;

                try {
                  if (!event.bubbles) {
                    event.cancelBubble = true;

                    var cancelBubbleEvent = function (event) {
                      event.cancelBubble = true;
                      (element || window).detachEvent('on' + type, cancelBubbleEvent);
                    };

                    this.attachEvent('on' + type, cancelBubbleEvent);
                  }

                  this.fireEvent('on' + type, event);
                } catch (error) {
                  event.target = element;

                  do {
                    event.currentTarget = element;

                    if ('_events' in element && typeof element._events[type] === 'function') {
                      element._events[type].call(element, event);
                    }

                    if (typeof element['on' + type] === 'function') {
                      element['on' + type].call(element, event);
                    }

                    element = element.nodeType === 9 ? element.parentWindow : element.parentNode;
                  } while (element && !event.cancelBubble);
                }

                return true;
              }; // Add the DOMContentLoaded Event


              document.attachEvent('onreadystatechange', function () {
                if (document.readyState === 'complete') {
                  document.dispatchEvent(new Event('DOMContentLoaded', {
                    bubbles: true
                  }));
                }
              });
            }
          })();
        }).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});
        var KEY_SPACE = 32;
        var DEBOUNCE_TIMEOUT_IN_SECONDS = 1;

        function Button($module) {
          this.$module = $module;
          this.debounceFormSubmitTimer = null;
        }
        /**
        * JavaScript 'shim' to trigger the click event of element(s) when the space key is pressed.
        *
        * Created since some Assistive Technologies (for example some Screenreaders)
        * will tell a user to press space on a 'button', so this functionality needs to be shimmed
        * See https://github.com/alphagov/govuk_elements/pull/272#issuecomment-233028270
        *
        * @param {object} event event
        */


        Button.prototype.handleKeyDown = function (event) {
          // get the target element
          var target = event.target; // if the element has a role='button' and the pressed key is a space, we'll simulate a click

          if (target.getAttribute('role') === 'button' && event.keyCode === KEY_SPACE) {
            event.preventDefault(); // trigger the target's click event

            target.click();
          }
        };
        /**
        * If the click quickly succeeds a previous click then nothing will happen.
        * This stops people accidentally causing multiple form submissions by
        * double clicking buttons.
        */


        Button.prototype.debounce = function (event) {
          var target = event.target; // Check the button that is clicked on has the preventDoubleClick feature enabled

          if (target.getAttribute('data-prevent-double-click') !== 'true') {
            return;
          } // If the timer is still running then we want to prevent the click from submitting the form


          if (this.debounceFormSubmitTimer) {
            event.preventDefault();
            return false;
          }

          this.debounceFormSubmitTimer = setTimeout(function () {
            this.debounceFormSubmitTimer = null;
          }.bind(this), DEBOUNCE_TIMEOUT_IN_SECONDS * 1000);
        };
        /**
        * Initialise an event listener for keydown at document level
        * this will help listening for later inserted elements with a role="button"
        */


        Button.prototype.init = function () {
          this.$module.addEventListener('keydown', this.handleKeyDown);
          this.$module.addEventListener('click', this.debounce);
        };
        /**
         * JavaScript 'polyfill' for HTML5's <details> and <summary> elements
         * and 'shim' to add accessiblity enhancements for all browsers
         *
         * http://caniuse.com/#feat=details
         */


        var KEY_ENTER = 13;
        var KEY_SPACE$1 = 32;

        function Details($module) {
          this.$module = $module;
        }

        Details.prototype.init = function () {
          if (!this.$module) {
            return;
          } // If there is native details support, we want to avoid running code to polyfill native behaviour.


          var hasNativeDetails = typeof this.$module.open === 'boolean';

          if (hasNativeDetails) {
            return;
          }

          this.polyfillDetails();
        };

        Details.prototype.polyfillDetails = function () {
          var $module = this.$module; // Save shortcuts to the inner summary and content elements

          var $summary = this.$summary = $module.getElementsByTagName('summary').item(0);
          var $content = this.$content = $module.getElementsByTagName('div').item(0); // If <details> doesn't have a <summary> and a <div> representing the content
          // it means the required HTML structure is not met so the script will stop

          if (!$summary || !$content) {
            return;
          } // If the content doesn't have an ID, assign it one now
          // which we'll need for the summary's aria-controls assignment


          if (!$content.id) {
            $content.id = 'details-content-' + generateUniqueID();
          } // Add ARIA role="group" to details


          $module.setAttribute('role', 'group'); // Add role=button to summary

          $summary.setAttribute('role', 'button'); // Add aria-controls

          $summary.setAttribute('aria-controls', $content.id); // Set tabIndex so the summary is keyboard accessible for non-native elements
          //
          // We have to use the camelcase `tabIndex` property as there is a bug in IE6/IE7 when we set the correct attribute lowercase:
          // See http://web.archive.org/web/20170120194036/http://www.saliences.com/browserBugs/tabIndex.html for more information.

          $summary.tabIndex = 0; // Detect initial open state

          var openAttr = $module.getAttribute('open') !== null;

          if (openAttr === true) {
            $summary.setAttribute('aria-expanded', 'true');
            $content.setAttribute('aria-hidden', 'false');
          } else {
            $summary.setAttribute('aria-expanded', 'false');
            $content.setAttribute('aria-hidden', 'true');
            $content.style.display = 'none';
          } // Bind an event to handle summary elements


          this.polyfillHandleInputs($summary, this.polyfillSetAttributes.bind(this));
        };
        /**
        * Define a statechange function that updates aria-expanded and style.display
        * @param {object} summary element
        */


        Details.prototype.polyfillSetAttributes = function () {
          var $module = this.$module;
          var $summary = this.$summary;
          var $content = this.$content;
          var expanded = $summary.getAttribute('aria-expanded') === 'true';
          var hidden = $content.getAttribute('aria-hidden') === 'true';
          $summary.setAttribute('aria-expanded', expanded ? 'false' : 'true');
          $content.setAttribute('aria-hidden', hidden ? 'false' : 'true');
          $content.style.display = expanded ? 'none' : '';
          var hasOpenAttr = $module.getAttribute('open') !== null;

          if (!hasOpenAttr) {
            $module.setAttribute('open', 'open');
          } else {
            $module.removeAttribute('open');
          }

          return true;
        };
        /**
        * Handle cross-modal click events
        * @param {object} node element
        * @param {function} callback function
        */


        Details.prototype.polyfillHandleInputs = function (node, callback) {
          node.addEventListener('keypress', function (event) {
            var target = event.target; // When the key gets pressed - check if it is enter or space

            if (event.keyCode === KEY_ENTER || event.keyCode === KEY_SPACE$1) {
              if (target.nodeName.toLowerCase() === 'summary') {
                // Prevent space from scrolling the page
                // and enter from submitting a form
                event.preventDefault(); // Click to let the click event do all the necessary action

                if (target.click) {
                  target.click();
                } else {
                  // except Safari 5.1 and under don't support .click() here
                  callback(event);
                }
              }
            }
          }); // Prevent keyup to prevent clicking twice in Firefox when using space key

          node.addEventListener('keyup', function (event) {
            var target = event.target;

            if (event.keyCode === KEY_SPACE$1) {
              if (target.nodeName.toLowerCase() === 'summary') {
                event.preventDefault();
              }
            }
          });
          node.addEventListener('click', callback);
        };

        function CharacterCount($module) {
          this.$module = $module;
          this.$textarea = $module.querySelector('.govuk-js-character-count');

          if (this.$textarea) {
            this.$countMessage = $module.querySelector('[id=' + this.$textarea.id + '-info]');
          }
        }

        CharacterCount.prototype.defaults = {
          characterCountAttribute: 'data-maxlength',
          wordCountAttribute: 'data-maxwords'
        }; // Initialize component

        CharacterCount.prototype.init = function () {
          // Check for module
          var $module = this.$module;
          var $textarea = this.$textarea;
          var $countMessage = this.$countMessage;

          if (!$textarea || !$countMessage) {
            return;
          } // We move count message right after the field
          // Kept for backwards compatibility


          $textarea.insertAdjacentElement('afterend', $countMessage); // Read options set using dataset ('data-' values)

          this.options = this.getDataset($module); // Determine the limit attribute (characters or words)

          var countAttribute = this.defaults.characterCountAttribute;

          if (this.options.maxwords) {
            countAttribute = this.defaults.wordCountAttribute;
          } // Save the element limit


          this.maxLength = $module.getAttribute(countAttribute); // Check for limit

          if (!this.maxLength) {
            return;
          } // Remove hard limit if set


          $module.removeAttribute('maxlength'); // Bind event changes to the textarea

          var boundChangeEvents = this.bindChangeEvents.bind(this);
          boundChangeEvents(); // Update count message

          var boundUpdateCountMessage = this.updateCountMessage.bind(this);
          boundUpdateCountMessage();
        }; // Read data attributes


        CharacterCount.prototype.getDataset = function (element) {
          var dataset = {};
          var attributes = element.attributes;

          if (attributes) {
            for (var i = 0; i < attributes.length; i++) {
              var attribute = attributes[i];
              var match = attribute.name.match(/^data-(.+)/);

              if (match) {
                dataset[match[1]] = attribute.value;
              }
            }
          }

          return dataset;
        }; // Counts characters or words in text


        CharacterCount.prototype.count = function (text) {
          var length;

          if (this.options.maxwords) {
            var tokens = text.match(/\S+/g) || []; // Matches consecutive non-whitespace chars

            length = tokens.length;
          } else {
            length = text.length;
          }

          return length;
        }; // Bind input propertychange to the elements and update based on the change


        CharacterCount.prototype.bindChangeEvents = function () {
          var $textarea = this.$textarea;
          $textarea.addEventListener('keyup', this.checkIfValueChanged.bind(this)); // Bind focus/blur events to start/stop polling

          $textarea.addEventListener('focus', this.handleFocus.bind(this));
          $textarea.addEventListener('blur', this.handleBlur.bind(this));
        }; // Speech recognition software such as Dragon NaturallySpeaking will modify the
        // fields by directly changing its `value`. These changes don't trigger events
        // in JavaScript, so we need to poll to handle when and if they occur.


        CharacterCount.prototype.checkIfValueChanged = function () {
          if (!this.$textarea.oldValue) this.$textarea.oldValue = '';

          if (this.$textarea.value !== this.$textarea.oldValue) {
            this.$textarea.oldValue = this.$textarea.value;
            var boundUpdateCountMessage = this.updateCountMessage.bind(this);
            boundUpdateCountMessage();
          }
        }; // Update message box


        CharacterCount.prototype.updateCountMessage = function () {
          var countElement = this.$textarea;
          var options = this.options;
          var countMessage = this.$countMessage; // Determine the remaining number of characters/words

          var currentLength = this.count(countElement.value);
          var maxLength = this.maxLength;
          var remainingNumber = maxLength - currentLength; // Set threshold if presented in options

          var thresholdPercent = options.threshold ? options.threshold : 0;
          var thresholdValue = maxLength * thresholdPercent / 100;

          if (thresholdValue > currentLength) {
            countMessage.classList.add('govuk-character-count__message--disabled'); // Ensure threshold is hidden for users of assistive technologies

            countMessage.setAttribute('aria-hidden', true);
          } else {
            countMessage.classList.remove('govuk-character-count__message--disabled'); // Ensure threshold is visible for users of assistive technologies

            countMessage.removeAttribute('aria-hidden');
          } // Update styles


          if (remainingNumber < 0) {
            countElement.classList.add('govuk-textarea--error');
            countMessage.classList.remove('govuk-hint');
            countMessage.classList.add('govuk-error-message');
          } else {
            countElement.classList.remove('govuk-textarea--error');
            countMessage.classList.remove('govuk-error-message');
            countMessage.classList.add('govuk-hint');
          } // Update message


          var charVerb = 'remaining';
          var charNoun = 'character';
          var displayNumber = remainingNumber;

          if (options.maxwords) {
            charNoun = 'word';
          }

          charNoun = charNoun + (remainingNumber === -1 || remainingNumber === 1 ? '' : 's');
          charVerb = remainingNumber < 0 ? 'too many' : 'remaining';
          displayNumber = Math.abs(remainingNumber);
          countMessage.innerHTML = 'You have ' + displayNumber + ' ' + charNoun + ' ' + charVerb;
        };

        CharacterCount.prototype.handleFocus = function () {
          // Check if value changed on focus
          this.valueChecker = setInterval(this.checkIfValueChanged.bind(this), 1000);
        };

        CharacterCount.prototype.handleBlur = function () {
          // Cancel value checking on blur
          clearInterval(this.valueChecker);
        };

        function Checkboxes($module) {
          this.$module = $module;
          this.$inputs = $module.querySelectorAll('input[type="checkbox"]');
        }

        Checkboxes.prototype.init = function () {
          var $module = this.$module;
          var $inputs = this.$inputs;
          /**
          * Loop over all items with [data-controls]
          * Check if they have a matching conditional reveal
          * If they do, assign attributes.
          **/

          nodeListForEach($inputs, function ($input) {
            var controls = $input.getAttribute('data-aria-controls'); // Check if input controls anything
            // Check if content exists, before setting attributes.

            if (!controls || !$module.querySelector('#' + controls)) {
              return;
            } // If we have content that is controlled, set attributes.


            $input.setAttribute('aria-controls', controls);
            $input.removeAttribute('data-aria-controls');
            this.setAttributes($input);
          }.bind(this)); // Handle events

          $module.addEventListener('click', this.handleClick.bind(this));
        };

        Checkboxes.prototype.setAttributes = function ($input) {
          var inputIsChecked = $input.checked;
          $input.setAttribute('aria-expanded', inputIsChecked);
          var $content = this.$module.querySelector('#' + $input.getAttribute('aria-controls'));

          if ($content) {
            $content.classList.toggle('govuk-checkboxes__conditional--hidden', !inputIsChecked);
          }
        };

        Checkboxes.prototype.handleClick = function (event) {
          var $target = event.target; // If a checkbox with aria-controls, handle click

          var isCheckbox = $target.getAttribute('type') === 'checkbox';
          var hasAriaControls = $target.getAttribute('aria-controls');

          if (isCheckbox && hasAriaControls) {
            this.setAttributes($target);
          }
        };

        (function (undefined) {
          // Detection from https://raw.githubusercontent.com/Financial-Times/polyfill-service/1f3c09b402f65bf6e393f933a15ba63f1b86ef1f/packages/polyfill-library/polyfills/Element/prototype/matches/detect.js
          var detect = 'document' in this && "matches" in document.documentElement;
          if (detect) return; // Polyfill from https://raw.githubusercontent.com/Financial-Times/polyfill-service/1f3c09b402f65bf6e393f933a15ba63f1b86ef1f/packages/polyfill-library/polyfills/Element/prototype/matches/polyfill.js

          Element.prototype.matches = Element.prototype.webkitMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.mozMatchesSelector || function matches(selector) {
            var element = this;
            var elements = (element.document || element.ownerDocument).querySelectorAll(selector);
            var index = 0;

            while (elements[index] && elements[index] !== element) {
              ++index;
            }

            return !!elements[index];
          };
        }).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});
        (function (undefined) {
          // Detection from https://raw.githubusercontent.com/Financial-Times/polyfill-service/1f3c09b402f65bf6e393f933a15ba63f1b86ef1f/packages/polyfill-library/polyfills/Element/prototype/closest/detect.js
          var detect = 'document' in this && "closest" in document.documentElement;
          if (detect) return; // Polyfill from https://raw.githubusercontent.com/Financial-Times/polyfill-service/1f3c09b402f65bf6e393f933a15ba63f1b86ef1f/packages/polyfill-library/polyfills/Element/prototype/closest/polyfill.js

          Element.prototype.closest = function closest(selector) {
            var node = this;

            while (node) {
              if (node.matches(selector)) return node;else node = 'SVGElement' in window && node instanceof SVGElement ? node.parentNode : node.parentElement;
            }

            return null;
          };
        }).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

        function ErrorSummary($module) {
          this.$module = $module;
        }

        ErrorSummary.prototype.init = function () {
          var $module = this.$module;

          if (!$module) {
            return;
          }

          $module.focus();
          $module.addEventListener('click', this.handleClick.bind(this));
        };
        /**
        * Click event handler
        *
        * @param {MouseEvent} event - Click event
        */


        ErrorSummary.prototype.handleClick = function (event) {
          var target = event.target;

          if (this.focusTarget(target)) {
            event.preventDefault();
          }
        };
        /**
         * Focus the target element
         *
         * By default, the browser will scroll the target into view. Because our labels
         * or legends appear above the input, this means the user will be presented with
         * an input without any context, as the label or legend will be off the top of
         * the screen.
         *
         * Manually handling the click event, scrolling the question into view and then
         * focussing the element solves this.
         *
         * This also results in the label and/or legend being announced correctly in
         * NVDA (as tested in 2018.3.2) - without this only the field type is announced
         * (e.g. "Edit, has autocomplete").
         *
         * @param {HTMLElement} $target - Event target
         * @returns {boolean} True if the target was able to be focussed
         */


        ErrorSummary.prototype.focusTarget = function ($target) {
          // If the element that was clicked was not a link, return early
          if ($target.tagName !== 'A' || $target.href === false) {
            return false;
          }

          var inputId = this.getFragmentFromUrl($target.href);
          var $input = document.getElementById(inputId);

          if (!$input) {
            return false;
          }

          var $legendOrLabel = this.getAssociatedLegendOrLabel($input);

          if (!$legendOrLabel) {
            return false;
          } // Scroll the legend or label into view *before* calling focus on the input to
          // avoid extra scrolling in browsers that don't support `preventScroll` (which
          // at time of writing is most of them...)


          $legendOrLabel.scrollIntoView();
          $input.focus({
            preventScroll: true
          });
          return true;
        };
        /**
         * Get fragment from URL
         *
         * Extract the fragment (everything after the hash) from a URL, but not including
         * the hash.
         *
         * @param {string} url - URL
         * @returns {string} Fragment from URL, without the hash
         */


        ErrorSummary.prototype.getFragmentFromUrl = function (url) {
          if (url.indexOf('#') === -1) {
            return false;
          }

          return url.split('#').pop();
        };
        /**
         * Get associated legend or label
         *
         * Returns the first element that exists from this list:
         *
         * - The `<legend>` associated with the closest `<fieldset>` ancestor, as long
         *   as the top of it is no more than half a viewport height away from the
         *   bottom of the input
         * - The first `<label>` that is associated with the input using for="inputId"
         * - The closest parent `<label>`
         *
         * @param {HTMLElement} $input - The input
         * @returns {HTMLElement} Associated legend or label, or null if no associated
         *                        legend or label can be found
         */


        ErrorSummary.prototype.getAssociatedLegendOrLabel = function ($input) {
          var $fieldset = $input.closest('fieldset');

          if ($fieldset) {
            var legends = $fieldset.getElementsByTagName('legend');

            if (legends.length) {
              var $candidateLegend = legends[0]; // If the input type is radio or checkbox, always use the legend if there
              // is one.

              if ($input.type === 'checkbox' || $input.type === 'radio') {
                return $candidateLegend;
              } // For other input types, only scroll to the fieldset’s legend (instead of
              // the label associated with the input) if the input would end up in the
              // top half of the screen.
              //
              // This should avoid situations where the input either ends up off the
              // screen, or obscured by a software keyboard.


              var legendTop = $candidateLegend.getBoundingClientRect().top;
              var inputRect = $input.getBoundingClientRect(); // If the browser doesn't support Element.getBoundingClientRect().height
              // or window.innerHeight (like IE8), bail and just link to the label.

              if (inputRect.height && window.innerHeight) {
                var inputBottom = inputRect.top + inputRect.height;

                if (inputBottom - legendTop < window.innerHeight / 2) {
                  return $candidateLegend;
                }
              }
            }
          }

          return document.querySelector("label[for='" + $input.getAttribute('id') + "']") || $input.closest('label');
        };

        function Header($module) {
          this.$module = $module;
        }

        Header.prototype.init = function () {
          // Check for module
          var $module = this.$module;

          if (!$module) {
            return;
          } // Check for button


          var $toggleButton = $module.querySelector('.govuk-js-header-toggle');

          if (!$toggleButton) {
            return;
          } // Handle $toggleButton click events


          $toggleButton.addEventListener('click', this.handleClick.bind(this));
        };
        /**
        * Toggle class
        * @param {object} node element
        * @param {string} className to toggle
        */


        Header.prototype.toggleClass = function (node, className) {
          if (node.className.indexOf(className) > 0) {
            node.className = node.className.replace(' ' + className, '');
          } else {
            node.className += ' ' + className;
          }
        };
        /**
        * An event handler for click event on $toggleButton
        * @param {object} event event
        */


        Header.prototype.handleClick = function (event) {
          var $module = this.$module;
          var $toggleButton = event.target || event.srcElement;
          var $target = $module.querySelector('#' + $toggleButton.getAttribute('aria-controls')); // If a button with aria-controls, handle click

          if ($toggleButton && $target) {
            this.toggleClass($target, 'govuk-header__navigation--open');
            this.toggleClass($toggleButton, 'govuk-header__menu-button--open');
            $toggleButton.setAttribute('aria-expanded', $toggleButton.getAttribute('aria-expanded') !== 'true');
            $target.setAttribute('aria-hidden', $target.getAttribute('aria-hidden') === 'false');
          }
        };

        function Radios($module) {
          this.$module = $module;
        }

        Radios.prototype.init = function () {
          var $module = this.$module;
          var $inputs = $module.querySelectorAll('input[type="radio"]');
          /**
          * Loop over all items with [data-controls]
          * Check if they have a matching conditional reveal
          * If they do, assign attributes.
          **/

          nodeListForEach($inputs, function ($input) {
            var controls = $input.getAttribute('data-aria-controls'); // Check if input controls anything
            // Check if content exists, before setting attributes.

            if (!controls || !$module.querySelector('#' + controls)) {
              return;
            } // If we have content that is controlled, set attributes.


            $input.setAttribute('aria-controls', controls);
            $input.removeAttribute('data-aria-controls');
            this.setAttributes($input);
          }.bind(this)); // Handle events

          $module.addEventListener('click', this.handleClick.bind(this));
        };

        Radios.prototype.setAttributes = function ($input) {
          var $content = document.querySelector('#' + $input.getAttribute('aria-controls'));

          if ($content && $content.classList.contains('govuk-radios__conditional')) {
            var inputIsChecked = $input.checked;
            $input.setAttribute('aria-expanded', inputIsChecked);
            $content.classList.toggle('govuk-radios__conditional--hidden', !inputIsChecked);
          }
        };

        Radios.prototype.handleClick = function (event) {
          var $clickedInput = event.target; // We only want to handle clicks for radio inputs

          if ($clickedInput.type !== 'radio') {
            return;
          } // Because checking one radio can uncheck a radio in another $module,
          // we need to call set attributes on all radios in the same form, or document if they're not in a form.
          //
          // We also only want radios which have aria-controls, as they support conditional reveals.


          var $allInputs = document.querySelectorAll('input[type="radio"][aria-controls]');
          nodeListForEach($allInputs, function ($input) {
            // Only inputs with the same form owner should change.
            var hasSameFormOwner = $input.form === $clickedInput.form; // In radios, only radios with the same name will affect each other.

            var hasSameName = $input.name === $clickedInput.name;

            if (hasSameName && hasSameFormOwner) {
              this.setAttributes($input);
            }
          }.bind(this));
        };

        (function (undefined) {
          // Detection from https://github.com/Financial-Times/polyfill-service/pull/1062/files#diff-b09a5d2acf3314b46a6c8f8d0c31b85c
          var detect = 'Element' in this && "nextElementSibling" in document.documentElement;
          if (detect) return;

          (function (global) {
            // There is no polyfill in polyfill-library (https://github.com/Financial-Times/polyfill-library/issues/338)
            // So we source this from https://github.com/Alhadis/Snippets/blob/e09b4dfb7ffc9e250bc28319051e39ead3e5f70a/js/polyfills/IE8-child-elements.js#L28-L33
            Object.defineProperty(Element.prototype, "nextElementSibling", {
              get: function () {
                var el = this.nextSibling;

                while (el && el.nodeType !== 1) {
                  el = el.nextSibling;
                }

                return el;
              }
            });
          })(this);
        }).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});
        (function (undefined) {
          // Detection from https://github.com/Financial-Times/polyfill-service/pull/1062/files#diff-a162235fbc9c0dd40d4032265f44942e
          var detect = 'Element' in this && 'previousElementSibling' in document.documentElement;
          if (detect) return;

          (function (global) {
            // There is no polyfill in polyfill-library (https://github.com/Financial-Times/polyfill-library/issues/338)
            // So we source this from https://github.com/Alhadis/Snippets/blob/e09b4dfb7ffc9e250bc28319051e39ead3e5f70a/js/polyfills/IE8-child-elements.js#L35-L40
            Object.defineProperty(Element.prototype, 'previousElementSibling', {
              get: function () {
                var el = this.previousSibling;

                while (el && el.nodeType !== 1) {
                  el = el.previousSibling;
                }

                return el;
              }
            });
          })(this);
        }).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

        function Tabs($module) {
          this.$module = $module;
          this.$tabs = $module.querySelectorAll('.govuk-tabs__tab');
          this.keys = {
            left: 37,
            right: 39,
            up: 38,
            down: 40
          };
          this.jsHiddenClass = 'govuk-tabs__panel--hidden';
        }

        Tabs.prototype.init = function () {
          if (typeof window.matchMedia === 'function') {
            this.setupResponsiveChecks();
          } else {
            this.setup();
          }
        };

        Tabs.prototype.setupResponsiveChecks = function () {
          this.mql = window.matchMedia('(min-width: 40.0625em)');
          this.mql.addListener(this.checkMode.bind(this));
          this.checkMode();
        };

        Tabs.prototype.checkMode = function () {
          if (this.mql.matches) {
            this.setup();
          } else {
            this.teardown();
          }
        };

        Tabs.prototype.setup = function () {
          var $module = this.$module;
          var $tabs = this.$tabs;
          var $tabList = $module.querySelector('.govuk-tabs__list');
          var $tabListItems = $module.querySelectorAll('.govuk-tabs__list-item');

          if (!$tabs || !$tabList || !$tabListItems) {
            return;
          }

          $tabList.setAttribute('role', 'tablist');
          nodeListForEach($tabListItems, function ($item) {
            $item.setAttribute('role', 'presentation');
          });
          nodeListForEach($tabs, function ($tab) {
            // Set HTML attributes
            this.setAttributes($tab); // Save bounded functions to use when removing event listeners during teardown

            $tab.boundTabClick = this.onTabClick.bind(this);
            $tab.boundTabKeydown = this.onTabKeydown.bind(this); // Handle events

            $tab.addEventListener('click', $tab.boundTabClick, true);
            $tab.addEventListener('keydown', $tab.boundTabKeydown, true); // Remove old active panels

            this.hideTab($tab);
          }.bind(this)); // Show either the active tab according to the URL's hash or the first tab

          var $activeTab = this.getTab(window.location.hash) || this.$tabs[0];
          this.showTab($activeTab); // Handle hashchange events

          $module.boundOnHashChange = this.onHashChange.bind(this);
          window.addEventListener('hashchange', $module.boundOnHashChange, true);
        };

        Tabs.prototype.teardown = function () {
          var $module = this.$module;
          var $tabs = this.$tabs;
          var $tabList = $module.querySelector('.govuk-tabs__list');
          var $tabListItems = $module.querySelectorAll('.govuk-tabs__list-item');

          if (!$tabs || !$tabList || !$tabListItems) {
            return;
          }

          $tabList.removeAttribute('role');
          nodeListForEach($tabListItems, function ($item) {
            $item.removeAttribute('role', 'presentation');
          });
          nodeListForEach($tabs, function ($tab) {
            // Remove events
            $tab.removeEventListener('click', $tab.boundTabClick, true);
            $tab.removeEventListener('keydown', $tab.boundTabKeydown, true); // Unset HTML attributes

            this.unsetAttributes($tab);
          }.bind(this)); // Remove hashchange event handler

          window.removeEventListener('hashchange', $module.boundOnHashChange, true);
        };

        Tabs.prototype.onHashChange = function (e) {
          var hash = window.location.hash;
          var $tabWithHash = this.getTab(hash);

          if (!$tabWithHash) {
            return;
          } // Prevent changing the hash


          if (this.changingHash) {
            this.changingHash = false;
            return;
          } // Show either the active tab according to the URL's hash or the first tab


          var $previousTab = this.getCurrentTab();
          this.hideTab($previousTab);
          this.showTab($tabWithHash);
          $tabWithHash.focus();
        };

        Tabs.prototype.hideTab = function ($tab) {
          this.unhighlightTab($tab);
          this.hidePanel($tab);
        };

        Tabs.prototype.showTab = function ($tab) {
          this.highlightTab($tab);
          this.showPanel($tab);
        };

        Tabs.prototype.getTab = function (hash) {
          return this.$module.querySelector('.govuk-tabs__tab[href="' + hash + '"]');
        };

        Tabs.prototype.setAttributes = function ($tab) {
          // set tab attributes
          var panelId = this.getHref($tab).slice(1);
          $tab.setAttribute('id', 'tab_' + panelId);
          $tab.setAttribute('role', 'tab');
          $tab.setAttribute('aria-controls', panelId);
          $tab.setAttribute('aria-selected', 'false');
          $tab.setAttribute('tabindex', '-1'); // set panel attributes

          var $panel = this.getPanel($tab);
          $panel.setAttribute('role', 'tabpanel');
          $panel.setAttribute('aria-labelledby', $tab.id);
          $panel.classList.add(this.jsHiddenClass);
        };

        Tabs.prototype.unsetAttributes = function ($tab) {
          // unset tab attributes
          $tab.removeAttribute('id');
          $tab.removeAttribute('role');
          $tab.removeAttribute('aria-controls');
          $tab.removeAttribute('aria-selected');
          $tab.removeAttribute('tabindex'); // unset panel attributes

          var $panel = this.getPanel($tab);
          $panel.removeAttribute('role');
          $panel.removeAttribute('aria-labelledby');
          $panel.classList.remove(this.jsHiddenClass);
        };

        Tabs.prototype.onTabClick = function (e) {
          if (!e.target.classList.contains('govuk-tabs__tab')) {
            // Allow events on child DOM elements to bubble up to tab parent
            return false;
          }

          e.preventDefault();
          var $newTab = e.target;
          var $currentTab = this.getCurrentTab();
          this.hideTab($currentTab);
          this.showTab($newTab);
          this.createHistoryEntry($newTab);
        };

        Tabs.prototype.createHistoryEntry = function ($tab) {
          var $panel = this.getPanel($tab); // Save and restore the id
          // so the page doesn't jump when a user clicks a tab (which changes the hash)

          var id = $panel.id;
          $panel.id = '';
          this.changingHash = true;
          window.location.hash = this.getHref($tab).slice(1);
          $panel.id = id;
        };

        Tabs.prototype.onTabKeydown = function (e) {
          switch (e.keyCode) {
            case this.keys.left:
            case this.keys.up:
              this.activatePreviousTab();
              e.preventDefault();
              break;

            case this.keys.right:
            case this.keys.down:
              this.activateNextTab();
              e.preventDefault();
              break;
          }
        };

        Tabs.prototype.activateNextTab = function () {
          var currentTab = this.getCurrentTab();
          var nextTabListItem = currentTab.parentNode.nextElementSibling;

          if (nextTabListItem) {
            var nextTab = nextTabListItem.querySelector('.govuk-tabs__tab');
          }

          if (nextTab) {
            this.hideTab(currentTab);
            this.showTab(nextTab);
            nextTab.focus();
            this.createHistoryEntry(nextTab);
          }
        };

        Tabs.prototype.activatePreviousTab = function () {
          var currentTab = this.getCurrentTab();
          var previousTabListItem = currentTab.parentNode.previousElementSibling;

          if (previousTabListItem) {
            var previousTab = previousTabListItem.querySelector('.govuk-tabs__tab');
          }

          if (previousTab) {
            this.hideTab(currentTab);
            this.showTab(previousTab);
            previousTab.focus();
            this.createHistoryEntry(previousTab);
          }
        };

        Tabs.prototype.getPanel = function ($tab) {
          var $panel = this.$module.querySelector(this.getHref($tab));
          return $panel;
        };

        Tabs.prototype.showPanel = function ($tab) {
          var $panel = this.getPanel($tab);
          $panel.classList.remove(this.jsHiddenClass);
        };

        Tabs.prototype.hidePanel = function (tab) {
          var $panel = this.getPanel(tab);
          $panel.classList.add(this.jsHiddenClass);
        };

        Tabs.prototype.unhighlightTab = function ($tab) {
          $tab.setAttribute('aria-selected', 'false');
          $tab.parentNode.classList.remove('govuk-tabs__list-item--selected');
          $tab.setAttribute('tabindex', '-1');
        };

        Tabs.prototype.highlightTab = function ($tab) {
          $tab.setAttribute('aria-selected', 'true');
          $tab.parentNode.classList.add('govuk-tabs__list-item--selected');
          $tab.setAttribute('tabindex', '0');
        };

        Tabs.prototype.getCurrentTab = function () {
          return this.$module.querySelector('.govuk-tabs__list-item--selected .govuk-tabs__tab');
        }; // this is because IE doesn't always return the actual value but a relative full path
        // should be a utility function most prob
        // http://labs.thesedays.com/blog/2010/01/08/getting-the-href-value-with-jquery-in-ie/


        Tabs.prototype.getHref = function ($tab) {
          var href = $tab.getAttribute('href');
          var hash = href.slice(href.indexOf('#'), href.length);
          return hash;
        };

        function initAll(options) {
          // Set the options to an empty object by default if no options are passed.
          options = typeof options !== 'undefined' ? options : {}; // Allow the user to initialise GOV.UK Frontend in only certain sections of the page
          // Defaults to the entire document if nothing is set.

          var scope = typeof options.scope !== 'undefined' ? options.scope : document;
          var $buttons = scope.querySelectorAll('[data-module="govuk-button"]');
          nodeListForEach($buttons, function ($button) {
            new Button($button).init();
          });
          var $accordions = scope.querySelectorAll('[data-module="govuk-accordion"]');
          nodeListForEach($accordions, function ($accordion) {
            new Accordion($accordion).init();
          });
          var $details = scope.querySelectorAll('[data-module="govuk-details"]');
          nodeListForEach($details, function ($detail) {
            new Details($detail).init();
          });
          var $characterCounts = scope.querySelectorAll('[data-module="govuk-character-count"]');
          nodeListForEach($characterCounts, function ($characterCount) {
            new CharacterCount($characterCount).init();
          });
          var $checkboxes = scope.querySelectorAll('[data-module="govuk-checkboxes"]');
          nodeListForEach($checkboxes, function ($checkbox) {
            new Checkboxes($checkbox).init();
          }); // Find first error summary module to enhance.

          var $errorSummary = scope.querySelector('[data-module="govuk-error-summary"]');
          new ErrorSummary($errorSummary).init(); // Find first header module to enhance.

          var $toggleButton = scope.querySelector('[data-module="govuk-header"]');
          new Header($toggleButton).init();
          var $radios = scope.querySelectorAll('[data-module="govuk-radios"]');
          nodeListForEach($radios, function ($radio) {
            new Radios($radio).init();
          });
          var $tabs = scope.querySelectorAll('[data-module="govuk-tabs"]');
          nodeListForEach($tabs, function ($tabs) {
            new Tabs($tabs).init();
          });
        }

        exports.initAll = initAll;
        exports.Accordion = Accordion;
        exports.Button = Button;
        exports.Details = Details;
        exports.CharacterCount = CharacterCount;
        exports.Checkboxes = Checkboxes;
        exports.ErrorSummary = ErrorSummary;
        exports.Header = Header;
        exports.Radios = Radios;
        exports.Tabs = Tabs;
      });
    }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
  }, {}]
}, {}, [1]);
