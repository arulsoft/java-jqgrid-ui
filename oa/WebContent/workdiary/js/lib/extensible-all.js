/*
 * Extensible 1.0.2
 * Copyright(c) 2010-2012 Extensible, LLC
 * licensing@ext.ensible.com
 * http://ext.ensible.com
 */
(function() {
	Ext.ns("Ext.ensible.ux", "Ext.ensible.sample", "Ext.ensible.plugins",
			"Ext.ensible.cal");
	Ext.onReady(function() {
		if (Ext.getScrollBarWidth() < 3) {
			Ext.getBody().addClass("x-no-scrollbar")
		}
		if (Ext.isWindows) {
			Ext.getBody().addClass("x-win")
		}
	});
	Ext
			.apply(
					Ext.ensible,
					{
						version : "1.0.2",
						versionDetails : {
							major : 1,
							minor : 0,
							patch : 2
						},
						extVersion : "3.2.0",
						hasBorderRadius : !(Ext.isIE || Ext.isOpera),
						log : function(a) {
						},
						Date : {
							use24HourTime : false,
							diff : function(f, a, c) {
								var b = 1, e = a.getTime() - f.getTime();
								if (c == "s") {
									b = 1000
								} else {
									if (c == "m") {
										b = 1000 * 60
									} else {
										if (c == "h") {
											b = 1000 * 60 * 60
										}
									}
								}
								return Math.round(e / b)
							},
							diffDays : function(e, a) {
								var b = 1000 * 60 * 60 * 24, c = a.clearTime(
										true).getTime()
										- e.clearTime(true).getTime();
								return Math.ceil(c / b)
							},
							copyTime : function(c, b) {
								var a = b.clone();
								a.setHours(c.getHours(), c.getMinutes(), c
										.getSeconds(), c.getMilliseconds());
								return a
							},
							compare : function(c, b, a) {
								var f = c, e = b;
								if (a !== true) {
									f = c.clone();
									f.setMilliseconds(0);
									e = b.clone();
									e.setMilliseconds(0)
								}
								return e.getTime() - f.getTime()
							},
							maxOrMin : function(a) {
								var f = (a ? 0 : Number.MAX_VALUE), c = 0, b = arguments[1], e = b.length;
								for (; c < e; c++) {
									f = Math[a ? "max" : "min"](f, b[c]
											.getTime())
								}
								return new Date(f)
							},
							max : function() {
								return this.maxOrMin.apply(this, [ true,
										arguments ])
							},
							min : function() {
								return this.maxOrMin.apply(this, [ false,
										arguments ])
							},
							isInRange : function(a, c, b) {
								return (a >= c && a <= b)
							},
							rangesOverlap : function(g, b, f, a) {
								var c = (g >= f && g <= a), e = (b >= f && b <= a), h = (g <= f && b >= a);
								return (c || e || h)
							},
							isWeekend : function(a) {
								return a.getDay() % 6 === 0
							},
							isWeekday : function(a) {
								return a.getDay() % 6 !== 0
							}
						}
					})
})();
if (Ext.XTemplate) {
	Ext.override(Ext.XTemplate, {
		applySubTemplate : function(a, i, h, e, c) {
			var g = this, f, l = g.tpls[a], k, b = [];
			if ((l.test && !l.test.call(g, i, h, e, c))
					|| (l.exec && l.exec.call(g, i, h, e, c))) {
				return ""
			}
			k = l.target ? l.target.call(g, i, h) : i;
			f = k.length;
			h = l.target ? i : h;
			if (l.target && Ext.isArray(k)) {
				Ext.each(k, function(m, n) {
					b[b.length] = l.compiled.call(g, m, h, n + 1, f)
				});
				return b.join("")
			}
			return l.compiled.call(g, k, h, e, c)
		}
	})
}
if (Ext.form.DateField) {
	Ext
			.override(
					Ext.form.DateField,
					{
						altFormats : "m/d/Y|n/j/Y|n/j/y|m/j/y|n/d/y|m/j/Y|n/d/Y|m-d-y|m-d-Y|m/d|m-d|md|mdy|mdY|d|Y-m-d|n-j|n/j",
						safeParse : function(b, c) {
							if (/[gGhH]/.test(c.replace(/(\\.)/g, ""))) {
								return Date.parseDate(b, c)
							} else {
								var a = Date.parseDate(b + " " + this.initTime,
										c + " " + this.initTimeFormat);
								if (a) {
									return a.clearTime()
								}
							}
						}
					})
}
if (Ext.data.Store) {
	Ext.override(Ext.data.Store, {
		add : function(b) {
			var e, a, c;
			b = [].concat(b);
			if (b.length < 1) {
				return
			}
			for (e = 0, len = b.length; e < len; e++) {
				a = b[e];
				a.join(this);
				if ((a.dirty || a.phantom) && this.modified.indexOf(a) == -1) {
					this.modified.push(a)
				}
			}
			c = this.data.length;
			this.data.addAll(b);
			if (this.snapshot) {
				this.snapshot.addAll(b)
			}
			this.fireEvent("add", this, b, c)
		},
		insert : function(c, b) {
			var e, a;
			b = [].concat(b);
			for (e = 0, len = b.length; e < len; e++) {
				a = b[e];
				this.data.insert(c + e, a);
				a.join(this);
				if ((a.dirty || a.phantom) && this.modified.indexOf(a) == -1) {
					this.modified.push(a)
				}
			}
			if (this.snapshot) {
				this.snapshot.addAll(b)
			}
			this.fireEvent("add", this, b, c)
		},
		createRecords : function(c, b, f) {
			var e = this.modified, h = b.length, a, g;
			for (g = 0; g < h; g++) {
				a = b[g];
				if (a.phantom && a.isValid()) {
					a.markDirty();
					if (e.indexOf(a) == -1) {
						e.push(a)
					}
				}
			}
			if (this.autoSave === true) {
				this.save()
			}
		}
	})
}
if (Ext.data.MemoryProxy) {
	Ext.data.MemoryProxy = function(b) {
		var a = {};
		a[Ext.data.Api.actions.read] = true;
		a[Ext.data.Api.actions.create] = true;
		a[Ext.data.Api.actions.update] = true;
		a[Ext.data.Api.actions.destroy] = true;
		Ext.data.MemoryProxy.superclass.constructor.call(this, {
			api : a
		});
		this.data = b
	};
	Ext.extend(Ext.data.MemoryProxy, Ext.data.DataProxy, {
		doRequest : function(f, c, g, b, h, e, a) {
			h.call(e, null, a, true)
		}
	})
}
if (Ext.DomHelper) {
	Ext
			.apply(
					Ext.DomHelper,
					function() {
						var x = null, l = /^(?:br|frame|hr|img|input|link|meta|range|spacer|wbr|area|param|col)$/i, n = /^table|tbody|tr|td$/i, e = /tag|children|cn|html$/i, t = /td|tr|tbody/i, p = /([a-z0-9-]+)\s*:\s*([^;\s]+(?:\s*[^;\s]+)*);?/gi, v = /end/i, s, o = "afterbegin", q = "afterend", c = "beforebegin", r = "beforeend", a = "<table>", i = "</table>", b = a
								+ "<tbody>", k = "</tbody>" + i, m = b + "<tr>", w = "</tr>"
								+ k;
						function h(B, D, C, E, A, y) {
							var z = s.insertHtml(E, Ext.getDom(B), u(D));
							return C ? Ext.get(z, true) : z
						}
						function u(D) {
							var z = "", y, C, B, E;
							if (typeof D == "string") {
								z = D
							} else {
								if (Ext.isArray(D)) {
									for ( var A = 0; A < D.length; A++) {
										if (D[A]) {
											z += u(D[A])
										}
									}
								} else {
									z += "<" + (D.tag = D.tag || "div");
									for (y in D) {
										C = D[y];
										if (!e.test(y)) {
											if (typeof C == "object") {
												z += " " + y + '="';
												for (B in C) {
													z += B + ":" + C[B] + ";"
												}
												z += '"'
											} else {
												z += " " + ({
													cls : "class",
													htmlFor : "for"
												}[y] || y) + '="' + C + '"'
											}
										}
									}
									if (l.test(D.tag)) {
										z += "/>"
									} else {
										z += ">";
										if ((E = D.children || D.cn)) {
											z += u(E)
										} else {
											if (D.html) {
												z += D.html
											}
										}
										z += "</" + D.tag + ">"
									}
								}
							}
							return z
						}
						function g(F, C, B, D) {
							x.innerHTML = [ C, B, D ].join("");
							var y = -1, A = x, z;
							while (++y < F) {
								A = A.firstChild
							}
							if (z = A.nextSibling) {
								var E = document.createDocumentFragment();
								while (A) {
									z = A.nextSibling;
									E.appendChild(A);
									A = z
								}
								A = E
							}
							return A
						}
						function f(y, z, B, A) {
							var C, D;
							x = x || document.createElement("div");
							if (y == "td" && (z == o || z == r) || !t.test(y)
									&& (z == c || z == q)) {
								return
							}
							D = z == c ? B : z == q ? B.nextSibling
									: z == o ? B.firstChild : null;
							if (z == c || z == q) {
								B = B.parentNode
							}
							if (y == "td" || (y == "tr" && (z == r || z == o))) {
								C = g(4, m, A, w)
							} else {
								if ((y == "tbody" && (z == r || z == o))
										|| (y == "tr" && (z == c || z == q))) {
									C = g(3, b, A, k)
								} else {
									C = g(2, a, A, i)
								}
							}
							B.insertBefore(C, D);
							return C
						}
						s = {
							markup : function(y) {
								return u(y)
							},
							applyStyles : function(y, z) {
								if (z) {
									var A;
									y = Ext.fly(y);
									if (typeof z == "function") {
										z = z.call()
									}
									if (typeof z == "string") {
										p.lastIndex = 0;
										while ((A = p.exec(z))) {
											y.setStyle(A[1], A[2])
										}
									} else {
										if (typeof z == "object") {
											y.setStyle(z)
										}
									}
								}
							},
							insertHtml : function(D, y, E) {
								var C = {}, A, G, F, I, B, z, H;
								D = D.toLowerCase();
								C[c] = [ "BeforeBegin", "previousSibling" ];
								C[q] = [ "AfterEnd", "nextSibling" ];
								if (y.insertAdjacentHTML) {
									if (n.test(y.tagName)
											&& (z = f(y.tagName.toLowerCase(),
													D, y, E))) {
										return z
									}
									C[o] = [ "AfterBegin", "firstChild" ];
									C[r] = [ "BeforeEnd", "lastChild" ];
									if ((A = C[D])) {
										y.insertAdjacentHTML(A[0], E);
										return y[A[1]]
									}
								} else {
									F = y.ownerDocument.createRange();
									G = "setStart"
											+ (v.test(D) ? "After" : "Before");
									if (C[D]) {
										F[G](y);
										if (F.createContextualFragment) {
											I = F.createContextualFragment(E)
										} else {
													I = document
															.createDocumentFragment(),
													H = document
															.createElement("div");
											I.appendChild(H);
											H.outerHTML = E
										}
										y.parentNode.insertBefore(I, D == c ? y
												: y.nextSibling);
										return y[(D == c ? "previous" : "next")
												+ "Sibling"]
									} else {
										B = (D == o ? "first" : "last")
												+ "Child";
										if (y.firstChild) {
											F[G](y[B]);
											I = F.createContextualFragment(E);
											if (D == o) {
												y.insertBefore(I, y.firstChild)
											} else {
												y.appendChild(I)
											}
										} else {
											y.innerHTML = E
										}
										return y[B]
									}
								}
								throw 'Illegal insertion point -> "' + D + '"'
							},
							insertBefore : function(y, A, z) {
								return h(y, A, z, c)
							},
							insertAfter : function(y, A, z) {
								return h(y, A, z, q, "nextSibling")
							},
							insertFirst : function(y, A, z) {
								return h(y, A, z, o, "firstChild")
							},
							append : function(y, A, z) {
								return h(y, A, z, r, "", true)
							},
							overwrite : function(y, A, z) {
								y = Ext.getDom(y);
								y.innerHTML = u(A);
								return z ? Ext.get(y.firstChild) : y.firstChild
							},
							createHtml : u
						};
						return s
					}())
}
Ext.ensible.cal.DayHeaderTemplate = function(a) {
	Ext.apply(this, a);
	this.allDayTpl = new Ext.ensible.cal.BoxLayoutTemplate(a);
	this.allDayTpl.compile();
	Ext.ensible.cal.DayHeaderTemplate.superclass.constructor
			.call(
					this,
					'<div class="ext-cal-hd-ct">',
					'<table class="ext-cal-hd-days-tbl" cellspacing="0" cellpadding="0">',
					"<tbody>",
					"<tr>",
					'<td class="ext-cal-gutter"></td>',
					'<td class="ext-cal-hd-days-td"><div class="ext-cal-hd-ad-inner">{allDayTpl}</div></td>',
					'<td class="ext-cal-gutter-rt"></td>', "</tr>", "</tbody>",
					"</table>", "</div>")
};
Ext.extend(Ext.ensible.cal.DayHeaderTemplate, Ext.XTemplate, {
	applyTemplate : function(a) {
		return Ext.ensible.cal.DayHeaderTemplate.superclass.applyTemplate.call(
				this, {
					allDayTpl : this.allDayTpl.apply(a)
				})
	}
});
Ext.ensible.cal.DayHeaderTemplate.prototype.apply = Ext.ensible.cal.DayHeaderTemplate.prototype.applyTemplate;
Ext.ensible.cal.DayBodyTemplate = function(a) {
	Ext.apply(this, a);
	Ext.ensible.cal.DayBodyTemplate.superclass.constructor
			.call(
					this,
					'<table class="ext-cal-bg-tbl" cellspacing="0" cellpadding="0" style="height:{dayHeight}px;">',
					"<tbody>",
					'<tr height="1">',
					'<td class="ext-cal-gutter"></td>',
					'<td colspan="{dayCount}">',
					'<div class="ext-cal-bg-rows">',
					'<div class="ext-cal-bg-rows-inner">',
					'<tpl for="times">',
					'<div class="ext-cal-bg-row ext-row-{[xindex]}" style="height:{parent.hourHeight}px;">',
					'<div class="ext-cal-bg-row-div {parent.hourSeparatorCls}" style="height:{parent.hourSeparatorHeight}px;"></div>',
					"</div>",
					"</tpl>",
					"</div>",
					"</div>",
					"</td>",
					"</tr>",
					"<tr>",
					'<td class="ext-cal-day-times">',
					'<tpl for="times">',
					'<div class="ext-cal-bg-row" style="height:{parent.hourHeight}px;">',
					'<div class="ext-cal-day-time-inner"  style="height:{parent.hourHeight-1}px;">{.}</div>',
					"</div>",
					"</tpl>",
					"</td>",
					'<tpl for="days">',
					'<td class="ext-cal-day-col">',
					'<div class="ext-cal-day-col-inner">',
					'<div id="{[this.id]}-day-col-{.:date("Ymd")}" class="ext-cal-day-col-gutter" style="height:{parent.dayHeight}px;"></div>',
					"</div>", "</td>", "</tpl>", "</tr>", "</tbody>",
					"</table>")
};
Ext
		.extend(
				Ext.ensible.cal.DayBodyTemplate,
				Ext.XTemplate,
				{
					applyTemplate : function(e) {
						this.today = new Date().clearTime();
						this.dayCount = this.dayCount || 1;
						var h = 0, l = [], f = e.viewStart.clone();
						for (; h < this.dayCount; h++) {
							l[h] = f.add(Date.DAY, h)
						}
						var a = [], b = this.viewStartHour, g = this.viewEndHour, c = this.hourIncrement, k = this.hourHeight
								* (g - b);
						fmt = Ext.ensible.Date.use24HourTime ? "G:i" : "ga";
						f = new Date("1/1/2010").clearTime().add(Date.HOUR, b);
						for (h = b; h < g; h++) {
							a.push(f.format(fmt));
							f = f.add(Date.MINUTE, c)
						}
						return Ext.ensible.cal.DayBodyTemplate.superclass.applyTemplate
								.call(
										this,
										{
											days : l,
											dayCount : l.length,
											times : a,
											hourHeight : this.hourHeight,
											hourSeparatorCls : this.showHourSeparator ? ""
													: "no-sep",
											dayHeight : k,
											hourSeparatorHeight : (this.hourHeight / 2) - 1
										})
					}
				});
Ext.ensible.cal.DayBodyTemplate.prototype.apply = Ext.ensible.cal.DayBodyTemplate.prototype.applyTemplate;
Ext.ensible.cal.BoxLayoutTemplate = function(a) {
	Ext.apply(this, a);
	var b = this.showWeekLinks ? '<div id="{weekLinkId}" class="ext-cal-week-link">{weekNum}</div>'
			: "";
	Ext.ensible.cal.BoxLayoutTemplate.superclass.constructor
			.call(
					this,
					'<tpl for="weeks">',
					'<div id="{[this.id]}-wk-{[xindex-1]}" class="ext-cal-wk-ct" style="top:{[this.getRowTop(xindex, xcount)]}%; height:{[this.getRowHeight(xcount)]}%;">',
					b,
					'<table class="ext-cal-bg-tbl" cellpadding="0" cellspacing="0">',
					"<tbody>",
					"<tr>",
					'<tpl for=".">',
					'<td id="{[this.id]}-day-{date:date("Ymd")}" class="{cellCls}">&#160;</td>',
					"</tpl>",
					"</tr>",
					"</tbody>",
					"</table>",
					'<table class="ext-cal-evt-tbl" cellpadding="0" cellspacing="0">',
					"<tbody>",
					"<tr>",
					'<tpl for=".">',
					'<td id="{[this.id]}-ev-day-{date:date("Ymd")}" class="{titleCls}"><div>{title}</div></td>',
					"</tpl>", "</tr>", "</tbody>", "</table>", "</div>",
					"</tpl>", {
						getRowTop : function(c, e) {
							return ((c - 1) * (100 / e))
						},
						getRowHeight : function(c) {
							return 100 / c
						}
					})
};
Ext
		.extend(
				Ext.ensible.cal.BoxLayoutTemplate,
				Ext.XTemplate,
				{
					firstWeekDateFormat : "D j",
					otherWeeksDateFormat : "j",
					singleDayDateFormat : "l, F j, Y",
					multiDayFirstDayFormat : "M j, Y",
					multiDayMonthStartFormat : "M j",
					applyTemplate : function(n) {
						Ext.apply(this, n);
						var k = 0, u = "", f = true, v = false, h = false, t = false, a = false, m = false, e = n.weekendCls, p = n.prevMonthCls, s = n.nextMonthCls, b = n.todayCls, g = [ [] ], r = new Date()
								.clearTime(), l = this.viewStart.clone(), c = this.startDate
								.getMonth();
						for (; k < this.weekCount || this.weekCount == -1; k++) {
							if (l > this.viewEnd) {
								break
							}
							g[k] = [];
							for ( var q = 0; q < this.dayCount; q++) {
								v = l.getTime() === r.getTime();
								h = f || (l.getDate() == 1);
								t = (l.getMonth() < c) && this.weekCount == -1;
								a = (l.getMonth() > c) && this.weekCount == -1;
								m = l.getDay() % 6 === 0;
								if (l.getDay() == 1) {
									g[k].weekNum = this.showWeekNumbers ? l
											.format("W") : "&#160;";
									g[k].weekLinkId = "ext-cal-week-"
											+ l.format("Ymd")
								}
								if (h) {
									if (v) {
										u = this.getTodayText()
									} else {
										u = l
												.format(this.dayCount == 1 ? this.singleDayDateFormat
														: (f ? this.multiDayFirstDayFormat
																: this.multiDayMonthStartFormat))
									}
								} else {
									var i = (k == 0 && this.showHeader !== true) ? this.firstWeekDateFormat
											: this.otherWeeksDateFormat;
									u = v ? this.getTodayText() : l.format(i)
								}
								g[k]
										.push({
											title : u,
											date : l.clone(),
											titleCls : "ext-cal-dtitle "
													+ (v ? " ext-cal-dtitle-today"
															: "")
													+ (k == 0 ? " ext-cal-dtitle-first"
															: "")
													+ (t ? " ext-cal-dtitle-prev"
															: "")
													+ (a ? " ext-cal-dtitle-next"
															: ""),
											cellCls : "ext-cal-day "
													+ (v ? " " + b : "")
													+ (q == 0 ? " ext-cal-day-first"
															: "")
													+ (t ? " " + p : "")
													+ (a ? " " + s : "")
													+ (m && e ? " " + e : "")
										});
								l = l.add(Date.DAY, 1);
								f = false
							}
						}
						return Ext.ensible.cal.BoxLayoutTemplate.superclass.applyTemplate
								.call(this, {
									weeks : g
								})
					},
					getTodayText : function() {
						var b = Ext.ensible.Date.use24HourTime ? "G:i "
								: "g:ia ", c = this.showTodayText !== false ? this.todayText
								: "", a = this.showTime !== false ? ' <span id="'
								+ this.id
								+ '-clock" class="ext-cal-dtitle-time" aria-live="off">'
								+ new Date().format(b) + "</span>"
								: "", e = c.length > 0 || a.length > 0 ? " &#8212; "
								: "";
						if (this.dayCount == 1) {
							return new Date().format(this.singleDayDateFormat)
									+ e + c + a
						}
						fmt = this.weekCount == 1 ? this.firstWeekDateFormat
								: this.otherWeeksDateFormat;
						return c.length > 0 ? c + a : new Date().format(fmt)
								+ a
					}
				});
Ext.ensible.cal.BoxLayoutTemplate.prototype.apply = Ext.ensible.cal.BoxLayoutTemplate.prototype.applyTemplate;
Ext.ensible.cal.MonthViewTemplate = function(a) {
	Ext.apply(this, a);
	this.weekTpl = new Ext.ensible.cal.BoxLayoutTemplate(a);
	this.weekTpl.compile();
	var b = this.showWeekLinks ? '<div class="ext-cal-week-link-hd">&#160;</div>'
			: "";
	Ext.ensible.cal.MonthViewTemplate.superclass.constructor
			.call(
					this,
					'<div class="ext-cal-inner-ct {extraClasses}">',
					'<div class="ext-cal-hd-ct ext-cal-month-hd">',
					b,
					'<table class="ext-cal-hd-days-tbl" cellpadding="0" cellspacing="0">',
					"<tbody>",
					"<tr>",
					'<tpl for="days">',
					'<th class="ext-cal-hd-day{[xindex==1 ? " ext-cal-day-first" : ""]}" title="{title}">{name}</th>',
					"</tpl>", "</tr>", "</tbody>", "</table>", "</div>",
					'<div class="ext-cal-body-ct">{weeks}</div>', "</div>")
};
Ext.extend(Ext.ensible.cal.MonthViewTemplate, Ext.XTemplate, {
	dayHeaderFormat : "D",
	dayHeaderTitleFormat : "l, F j, Y",
	applyTemplate : function(g) {
		var h = [], e = this.weekTpl.apply(g), c = g.viewStart;
		for ( var b = 0; b < 7; b++) {
			var f = c.add(Date.DAY, b);
			h.push({
				name : f.format(this.dayHeaderFormat),
				title : f.format(this.dayHeaderTitleFormat)
			})
		}
		var a = this.showHeader === true ? "" : "ext-cal-noheader";
		if (this.showWeekLinks) {
			a += " ext-cal-week-links"
		}
		return Ext.ensible.cal.MonthViewTemplate.superclass.applyTemplate.call(
				this, {
					days : h,
					weeks : e,
					extraClasses : a
				})
	}
});
Ext.ensible.cal.MonthViewTemplate.prototype.apply = Ext.ensible.cal.MonthViewTemplate.prototype.applyTemplate;
Ext.dd.ScrollManager = function() {
	var c = Ext.dd.DragDropMgr;
	var f = {};
	var b = null;
	var i = {};
	var h = function(m) {
		b = null;
		a()
	};
	var k = function() {
		if (c.dragCurrent) {
			c.refreshCache(c.dragCurrent.groups)
		}
	};
	var e = function() {
		if (c.dragCurrent) {
			var m = Ext.dd.ScrollManager;
			var n = i.el.ddScrollConfig ? i.el.ddScrollConfig.increment
					: m.increment;
			if (!m.animate) {
				if (i.el.scroll(i.dir, n)) {
					k()
				}
			} else {
				i.el.scroll(i.dir, n, true, m.animDuration, k)
			}
		}
	};
	var a = function() {
		if (i.id) {
			clearInterval(i.id)
		}
		i.id = 0;
		i.el = null;
		i.dir = ""
	};
	var g = function(n, m) {
		a();
		i.el = n;
		i.dir = m;
		var p = (n.ddScrollConfig && n.ddScrollConfig.frequency) ? n.ddScrollConfig.frequency
				: Ext.dd.ScrollManager.frequency, o = n.ddScrollConfig ? n.ddScrollConfig.ddGroup
				: undefined;
		if (o === undefined || c.dragCurrent.ddGroup == o) {
			i.id = setInterval(e, p)
		}
	};
	var l = function(p, s) {
		if (s || !c.dragCurrent) {
			return
		}
		var t = Ext.dd.ScrollManager;
		if (!b || b != c.dragCurrent) {
			b = c.dragCurrent;
			t.refreshCache()
		}
		var u = Ext.lib.Event.getXY(p);
		var v = new Ext.lib.Point(u[0], u[1]);
		for ( var n in f) {
			var o = f[n], m = o._region;
			var q = o.ddScrollConfig ? o.ddScrollConfig : t;
			if (m && m.contains(v) && o.isScrollable()) {
				if (m.bottom - v.y <= q.vthresh) {
					if (i.el != o) {
						g(o, "down")
					}
					return
				} else {
					if (m.right - v.x <= q.hthresh) {
						if (i.el != o) {
							g(o, "left")
						}
						return
					} else {
						if (v.y - m.top <= q.vthresh) {
							if (i.el != o) {
								g(o, "up")
							}
							return
						} else {
							if (v.x - m.left <= q.hthresh) {
								if (i.el != o) {
									g(o, "right")
								}
								return
							}
						}
					}
				}
			}
		}
		a()
	};
	c.fireEvents = c.fireEvents.createSequence(l, c);
	c.stopDrag = c.stopDrag.createSequence(h, c);
	return {
		register : function(o) {
			if (Ext.isArray(o)) {
				for ( var n = 0, m = o.length; n < m; n++) {
					this.register(o[n])
				}
			} else {
				o = Ext.get(o);
				f[o.id] = o
			}
		},
		unregister : function(o) {
			if (Ext.isArray(o)) {
				for ( var n = 0, m = o.length; n < m; n++) {
					this.unregister(o[n])
				}
			} else {
				o = Ext.get(o);
				delete f[o.id]
			}
		},
		vthresh : 25,
		hthresh : 25,
		increment : 100,
		frequency : 500,
		animate : true,
		animDuration : 0.4,
		refreshCache : function() {
			for ( var m in f) {
				if (typeof f[m] == "object") {
					f[m]._region = f[m].getRegion()
				}
			}
		}
	}
}();
Ext.ensible.cal.StatusProxy = function(a) {
	Ext.apply(this, a);
	this.id = this.id || Ext.id();
	this.el = new Ext.Layer({
		dh : {
			id : this.id,
			cls : "ext-dd-drag-proxy x-dd-drag-proxy " + this.dropNotAllowed,
			cn : [ {
				cls : "x-dd-drop-icon"
			}, {
				cls : "ext-dd-ghost-ct",
				cn : [ {
					cls : "x-dd-drag-ghost"
				}, {
					cls : "ext-dd-msg"
				} ]
			} ]
		},
		shadow : !a || a.shadow !== false
	});
	this.ghost = Ext.get(this.el.dom.childNodes[1].childNodes[0]);
	this.message = Ext.get(this.el.dom.childNodes[1].childNodes[1]);
	this.dropStatus = this.dropNotAllowed
};
Ext.extend(Ext.ensible.cal.StatusProxy, Ext.dd.StatusProxy, {
	moveEventCls : "ext-cal-dd-move",
	addEventCls : "ext-cal-dd-add",
	update : function(a) {
		if (typeof a == "string") {
			this.ghost.update(a)
		} else {
			this.ghost.update("");
			a.style.margin = "0";
			this.ghost.dom.appendChild(a)
		}
		var b = this.ghost.dom.firstChild;
		if (b) {
			Ext.fly(b).setStyle("float", "none").setHeight("auto");
			Ext.getDom(b).id += "-ddproxy"
		}
	},
	updateMsg : function(a) {
		this.message.update(a)
	}
});
Ext.ensible.cal.DragZone = Ext
		.extend(
				Ext.dd.DragZone,
				{
					ddGroup : "CalendarDD",
					eventSelector : ".ext-cal-evt",
					constructor : function(b, a) {
						if (!Ext.ensible.cal._statusProxyInstance) {
							Ext.ensible.cal._statusProxyInstance = new Ext.ensible.cal.StatusProxy()
						}
						this.proxy = Ext.ensible.cal._statusProxyInstance;
						Ext.ensible.cal.DragZone.superclass.constructor.call(
								this, b, a)
					},
					getDragData : function(b) {
						var a = b.getTarget(this.eventSelector, 3);
						if (a) {
							var c = this.view.getEventRecordFromEl(a);
							if (!c) {
								return
							}
							return {
								type : "eventdrag",
								ddel : a,
								eventStart : c.data[Ext.ensible.cal.EventMappings.StartDate.name],
								eventEnd : c.data[Ext.ensible.cal.EventMappings.EndDate.name],
								proxy : this.proxy
							}
						}
						a = this.view.getDayAt(b.xy[0], b.xy[1]);
						if (a.el) {
							return {
								type : "caldrag",
								start : a.date,
								proxy : this.proxy
							}
						}
						return null
					},
					onInitDrag : function(a, e) {
						if (this.dragData.ddel) {
							var b = this.dragData.ddel.cloneNode(true), c = Ext
									.fly(b).child("dl");
							Ext.fly(b).setWidth("auto");
							if (c) {
								c.setHeight("auto")
							}
							this.proxy.update(b);
							this.onStartDrag(a, e)
						} else {
							if (this.dragData.start) {
								this.onStartDrag(a, e)
							}
						}
						this.view.onInitDrag();
						return true
					},
					afterRepair : function() {
						if (Ext.enableFx && this.dragData.ddel) {
							Ext.Element.fly(this.dragData.ddel).highlight(
									this.hlColor || "c3daf9")
						}
						this.dragging = false
					},
					getRepairXY : function(a) {
						if (this.dragData.ddel) {
							return Ext.Element.fly(this.dragData.ddel).getXY()
						}
					},
					afterInvalidDrop : function(a, b) {
						Ext.select(".ext-dd-shim").hide()
					},
					destroy : function() {
						Ext.ensible.cal.DragZone.superclass.destroy.call(this);
						delete Ext.ensible.cal._statusProxyInstance
					}
				});
Ext.ensible.cal.DropZone = Ext
		.extend(
				Ext.dd.DropZone,
				{
					ddGroup : "CalendarDD",
					eventSelector : ".ext-cal-evt",
					dateRangeFormat : "{0}-{1}",
					dateFormat : "n/j",
					shims : [],
					getTargetFromEvent : function(b) {
						var a = this.dragOffset || 0, f = b.getPageY() - a, c = this.view
								.getDayAt(b.getPageX(), f);
						return c.el ? c : null
					},
					onNodeOver : function(f, l, k, h) {
						var a = Ext.ensible.Date, b = h.type == "eventdrag" ? f.date
								: a.min(h.start, f.date), g = h.type == "eventdrag" ? f.date
								.add(Date.DAY, a.diffDays(h.eventStart,
										h.eventEnd))
								: a.max(h.start, f.date);
						if (!this.dragStartDate || !this.dragEndDate
								|| (a.diffDays(b, this.dragStartDate) != 0)
								|| (a.diffDays(g, this.dragEndDate) != 0)) {
							this.dragStartDate = b;
							this.dragEndDate = g.clearTime().add(Date.DAY, 1)
									.add(Date.MINUTE, -30);
							this.shim(b, g);
							var i = b.format(this.dateFormat);
							if (a.diffDays(b, g) > 0) {
								g = g.format(this.dateFormat);
								i = String.format(this.dateRangeFormat, i, g)
							}
							var c = String.format(
									h.type == "eventdrag" ? this.moveText
											: this.createText, i);
							h.proxy.updateMsg(c)
						}
						return this.dropAllowed
					},
					shim : function(a, f) {
						this.currWeek = -1;
						var b = a.clone(), g = 0, e, h, c = Ext.ensible.Date
								.diffDays(b, f) + 1;
						Ext.each(this.shims, function(i) {
							if (i) {
								i.isActive = false
							}
						});
						while (g++ < c) {
							var k = this.view.getDayEl(b);
							if (k) {
								var l = this.view.getWeekIndex(b), e = this.shims[l];
								if (!e) {
									e = this.createShim();
									this.shims[l] = e
								}
								if (l != this.currWeek) {
									e.boxInfo = k.getBox();
									this.currWeek = l
								} else {
									h = k.getBox();
									e.boxInfo.right = h.right;
									e.boxInfo.width = h.right - e.boxInfo.x
								}
								e.isActive = true
							}
							b = b.add(Date.DAY, 1)
						}
						Ext.each(this.shims, function(i) {
							if (i) {
								if (i.isActive) {
									i.show();
									i.setBox(i.boxInfo)
								} else {
									if (i.isVisible()) {
										i.hide()
									}
								}
							}
						})
					},
					createShim : function() {
						var a = this.view.ownerCalendarPanel ? this.view.ownerCalendarPanel
								: this.view;
						if (!this.shimCt) {
							this.shimCt = Ext.get("ext-dd-shim-ct-" + a.id);
							if (!this.shimCt) {
								this.shimCt = document.createElement("div");
								this.shimCt.id = "ext-dd-shim-ct-" + a.id;
								a.getEl().parent().appendChild(this.shimCt)
							}
						}
						var b = document.createElement("div");
						b.className = "ext-dd-shim";
						this.shimCt.appendChild(b);
						return new Ext.Layer({
							shadow : false,
							useDisplay : true,
							constrain : false
						}, b)
					},
					clearShims : function() {
						Ext.each(this.shims, function(a) {
							if (a) {
								a.hide()
							}
						})
					},
					onContainerOver : function(a, c, b) {
						return this.dropAllowed
					},
					onCalendarDragComplete : function() {
						delete this.dragStartDate;
						delete this.dragEndDate;
						this.clearShims()
					},
					onNodeDrop : function(h, a, f, c) {
						if (h && c) {
							if (c.type == "eventdrag") {
								var g = this.view.getEventRecordFromEl(c.ddel), b = Ext.ensible.Date
										.copyTime(
												g.data[Ext.ensible.cal.EventMappings.StartDate.name],
												h.date);
								this.view.onEventDrop(g, b);
								this.onCalendarDragComplete();
								return true
							}
							if (c.type == "caldrag") {
								this.view.onCalendarEndDrag(this.dragStartDate,
										this.dragEndDate,
										this.onCalendarDragComplete
												.createDelegate(this));
								return true
							}
						}
						this.onCalendarDragComplete();
						return false
					},
					onContainerDrop : function(a, c, b) {
						this.onCalendarDragComplete();
						return false
					},
					destroy : function() {
						Ext.each(this.shims, function(a) {
							if (a) {
								Ext.destroy(a)
							}
						});
						Ext.removeNode(this.shimCt);
						delete this.shimCt;
						this.shims.length = 0
					}
				});
Ext.ensible.cal.DayViewDragZone = Ext
		.extend(
				Ext.ensible.cal.DragZone,
				{
					ddGroup : "DayViewDD",
					resizeSelector : ".ext-evt-rsz",
					getDragData : function(c) {
						var a = c.getTarget(this.resizeSelector, 2, true);
						if (a) {
							var b = a.parent(this.eventSelector), f = this.view
									.getEventRecordFromEl(b);
							if (!f) {
								return
							}
							return {
								type : "eventresize",
								xy : c.xy,
								ddel : b.dom,
								eventStart : f.data[Ext.ensible.cal.EventMappings.StartDate.name],
								eventEnd : f.data[Ext.ensible.cal.EventMappings.EndDate.name],
								proxy : this.proxy
							}
						}
						var a = c.getTarget(this.eventSelector, 3);
						if (a) {
							var f = this.view.getEventRecordFromEl(a);
							if (!f) {
								return
							}
							return {
								type : "eventdrag",
								xy : c.xy,
								ddel : a,
								eventStart : f.data[Ext.ensible.cal.EventMappings.StartDate.name],
								eventEnd : f.data[Ext.ensible.cal.EventMappings.EndDate.name],
								proxy : this.proxy
							}
						}
						a = this.view.getDayAt(c.xy[0], c.xy[1]);
						if (a.el) {
							return {
								type : "caldrag",
								dayInfo : a,
								proxy : this.proxy
							}
						}
						return null
					}
				});
Ext.ensible.cal.DayViewDropZone = Ext
		.extend(
				Ext.ensible.cal.DropZone,
				{
					ddGroup : "DayViewDD",
					dateRangeFormat : "{0}-{1}",
					dateFormat : "n/j",
					onNodeOver : function(c, p, m, i) {
						var b, q = this.createText, h = Ext.ensible.Date.use24HourTime ? "G:i"
								: "g:ia";
						if (i.type == "caldrag") {
							if (!this.dragStartMarker) {
								this.dragStartMarker = c.el.parent()
										.createChild({
											style : "position:absolute;"
										});
								this.dragStartMarker.setBox(i.dayInfo.timeBox);
								this.dragCreateDt = i.dayInfo.date
							}
							var l, k = this.dragStartMarker.getBox();
							k.height = Math.ceil(Math.abs(m.xy[1] - k.y)
									/ c.timeBox.height)
									* c.timeBox.height;
							if (m.xy[1] < k.y) {
								k.height += c.timeBox.height;
								k.y = k.y - k.height + c.timeBox.height;
								l = this.dragCreateDt.add(Date.MINUTE,
										this.ddIncrement)
							} else {
								c.date = c.date.add(Date.MINUTE,
										this.ddIncrement)
							}
							this.shim(this.dragCreateDt, k);
							var o = Ext.ensible.Date.diff(this.dragCreateDt,
									c.date), t = this.dragCreateDt.add(
									Date.MILLI, o);
							this.dragStartDate = Ext.ensible.Date.min(
									this.dragCreateDt, t);
							this.dragEndDate = l
									|| Ext.ensible.Date.max(this.dragCreateDt,
											t);
							b = String.format(this.dateRangeFormat,
									this.dragStartDate.format(h),
									this.dragEndDate.format(h))
						} else {
							var s = Ext.get(i.ddel), r = s.parent().parent(), k = s
									.getBox();
							k.width = r.getWidth();
							if (i.type == "eventdrag") {
								if (this.dragOffset === undefined) {
									var f = this.view
											.getDayAt(i.xy[0], i.xy[1]).timeBox;
									this.dragOffset = f.y - k.y
								} else {
									k.y = c.timeBox.y
								}
								b = c.date.format(this.dateFormat + " " + h);
								k.x = c.el.getLeft();
								this.shim(c.date, k);
								q = this.moveText
							}
							if (i.type == "eventresize") {
								if (!this.resizeDt) {
									this.resizeDt = c.date
								}
								k.x = r.getLeft();
								k.height = Math.ceil(Math.abs(m.xy[1] - k.y)
										/ c.timeBox.height)
										* c.timeBox.height;
								if (m.xy[1] < k.y) {
									k.y -= k.height
								} else {
									c.date = c.date.add(Date.MINUTE,
											this.ddIncrement)
								}
								this.shim(this.resizeDt, k);
								var o = Ext.ensible.Date.diff(this.resizeDt,
										c.date), t = this.resizeDt.add(
										Date.MILLI, o), a = Ext.ensible.Date
										.min(i.eventStart, t), g = Ext.ensible.Date
										.max(i.eventStart, t);
								i.resizeDates = {
									StartDate : a,
									EndDate : g
								};
								b = String.format(this.dateRangeFormat, a
										.format(h), g.format(h));
								q = this.resizeText
							}
						}
						i.proxy.updateMsg(String.format(q, b));
						return this.dropAllowed
					},
					shim : function(b, a) {
						Ext.each(this.shims, function(e) {
							if (e) {
								e.isActive = false;
								e.hide()
							}
						});
						var c = this.shims[0];
						if (!c) {
							c = this.createShim();
							this.shims[0] = c
						}
						c.isActive = true;
						c.show();
						c.setBox(a)
					},
					onNodeDrop : function(g, a, c, b) {
						if (g && b) {
							if (b.type == "eventdrag") {
								var f = this.view.getEventRecordFromEl(b.ddel);
								this.view.onEventDrop(f, g.date);
								this.onCalendarDragComplete();
								delete this.dragOffset;
								return true
							}
							if (b.type == "eventresize") {
								var f = this.view.getEventRecordFromEl(b.ddel);
								this.view.onEventResize(f, b.resizeDates);
								this.onCalendarDragComplete();
								delete this.resizeDt;
								return true
							}
							if (b.type == "caldrag") {
								Ext.destroy(this.dragStartMarker);
								delete this.dragStartMarker;
								delete this.dragCreateDt;
								this.view.onCalendarEndDrag(this.dragStartDate,
										this.dragEndDate,
										this.onCalendarDragComplete
												.createDelegate(this));
								return true
							}
						}
						this.onCalendarDragComplete();
						return false
					}
				});
Ext.ensible.cal.EventStore = Ext.extend(Ext.data.Store, {
	constructor : function(a) {
		this.deferLoad = a.autoLoad;
		a.autoLoad = false;
		Ext.ensible.cal.EventStore.superclass.constructor
				.apply(this, arguments)
	},
	load : function(a) {
		Ext.ensible.log("store load");
		if (a.params) {
			delete this.initialParams
		}
		if (this.initialParams) {
			a = Ext.isObject(a) ? a : {};
			a.params = a.params || {};
			Ext.apply(a.params, this.initialParams);
			delete this.initialParams
		}
		Ext.ensible.cal.EventStore.superclass.load.call(this, a)
	}
});
Ext.reg("extensible.eventstore", Ext.ensible.cal.EventStore);
Ext.ensible.cal.EventMappings = {
	EventId : {
		name : "EventId",
		mapping : "id",
		type : "int"
	},
	CalendarId : {
		name : "CalendarId",
		mapping : "cid",
		type : "int"
	},
	Title : {
		name : "Title",
		mapping : "title",
		type : "string"
	},
	StartDate : {
		name : "StartDate",
		mapping : "start",
		type : "date",
		dateFormat : "c"
	},
	EndDate : {
		name : "EndDate",
		mapping : "end",
		type : "date",
		dateFormat : "c"
	},
	RRule : {
		name : "RecurRule",
		mapping : "recur_rule"
	},
	Location : {
		name : "Location",
		mapping : "loc",
		type : "string"
	},
	Notes : {
		name : "Notes",
		mapping : "notes",
		type : "string"
	},
	Url : {
		name : "Url",
		mapping : "url",
		type : "string"
	},
	IsAllDay : {
		name : "IsAllDay",
		mapping : "ad",
		type : "boolean"
	},
	Reminder : {
		name : "Reminder",
		mapping : "rem",
		type : "string"
	}
};
Ext.ensible.cal.CalendarMappings = {
	CalendarId : {
		name : "CalendarId",
		mapping : "id",
		type : "int"
	},
	Title : {
		name : "Title",
		mapping : "title",
		type : "string"
	},
	Description : {
		name : "Description",
		mapping : "desc",
		type : "string"
	},
	ColorId : {
		name : "ColorId",
		mapping : "color",
		type : "int"
	},
	IsHidden : {
		name : "IsHidden",
		mapping : "hidden",
		type : "boolean"
	}
};
Ext.ensible.cal.EventRecord = Ext.extend(Ext.data.Record, {
	fields : new Ext.util.MixedCollection(false, function(a) {
		return a.name
	})
});
Ext.ensible.cal.EventRecord.reconfigure = function() {
	var f = Ext.ensible.cal, g = f.EventMappings, e = f.EventRecord.prototype, b = [];
	for (prop in g) {
		if (g.hasOwnProperty(prop)) {
			b.push(g[prop])
		}
	}
	e.fields.clear();
	for ( var c = 0, a = b.length; c < a; c++) {
		e.fields.add(new Ext.data.Field(b[c]))
	}
	return f.EventRecord
};
Ext.ensible.cal.EventRecord.reconfigure();
Ext.ensible.cal.CalendarRecord = Ext.extend(Ext.data.Record, {
	fields : new Ext.util.MixedCollection(false, function(a) {
		return a.name
	})
});
Ext.ensible.cal.CalendarRecord.reconfigure = function() {
	var f = Ext.ensible.cal, g = f.CalendarMappings, e = f.CalendarRecord.prototype, b = [];
	for (prop in g) {
		if (g.hasOwnProperty(prop)) {
			b.push(g[prop])
		}
	}
	e.fields.clear();
	for ( var c = 0, a = b.length; c < a; c++) {
		e.fields.add(new Ext.data.Field(b[c]))
	}
	return f.CalendarRecord
};
Ext.ensible.cal.CalendarRecord.reconfigure();
Ext.ensible.cal.WeekEventRenderer = function() {
	var a = function(c, e, k) {
		var h = 1, i = Ext.get(c + "-wk-" + e), g, f;
		if (i) {
			f = i.child(".ext-cal-evt-tbl", true);
			g = f.tBodies[0].childNodes[k + h];
			if (!g) {
				g = Ext.DomHelper.append(f.tBodies[0], "<tr></tr>")
			}
		}
		return Ext.get(g)
	};
	var b = function(g, n, e, f, c, i, h) {
		var m = Ext.ensible.cal.EventMappings, p = g.data || g.event.data, q = i
				.clone(), r = q.add(Date.DAY, c - e).add(Date.MILLI, -1), k = a(
				h.viewId, n, f), o = Ext.ensible.Date.diffDays(i,
				p[m.EndDate.name]) + 1, l = Math.min(o, c - e);
		p._weekIndex = n;
		p._renderAsAllDay = p[m.IsAllDay.name] || g.isSpanStart;
		p.spanLeft = p[m.StartDate.name].getTime() < q.getTime();
		p.spanRight = p[m.EndDate.name].getTime() > r.getTime();
		p.spanCls = (p.spanLeft ? (p.spanRight ? "ext-cal-ev-spanboth"
				: "ext-cal-ev-spanleft")
				: (p.spanRight ? "ext-cal-ev-spanright" : ""));
		var s = {
			tag : "td",
			cls : "ext-cal-ev",
			cn : h.tpl.apply(h.templateDataFn(p))
		};
		if (l > 1) {
			s.colspan = l
		}
		Ext.DomHelper.append(k, s)
	};
	return {
		render : function(w) {
			var y = this, z = "&#160;", t = 0, i = w.eventGrid, k = w.viewStart
					.clone(), n = "", o = w.tpl, r = w.maxEventsPerDay != undefined ? w.maxEventsPerDay
					: 999, u = w.weekCount < 1 ? 6 : w.weekCount, p = w.weekCount == 1 ? w.dayCount
					: 7, v, q, c, g, h, s, f, m, l, e;
			for (; t < u; t++) {
				q = 0;
				c = i[t];
				for (; q < p; q++) {
					if (c && c[q]) {
						g = 0;
						h = 0;
						s = c[q];
						f = s.length;
						n = k.format("Ymd");
						for (; g < f; g++) {
							if (!s[g]) {
								if (g >= r) {
									continue
								}
								v = a(w.viewId, t, g);
								Ext.DomHelper.append(v, {
									tag : "td",
									cls : "ext-cal-ev",
									html : z,
									id : w.viewId + "-empty-" + f + "-day-" + n
								})
							} else {
								if (g >= r) {
									h++;
									continue
								}
								m = s[g];
								if (!m.isSpan || m.isSpanStart) {
									b(m, t, q, g, p, k, w)
								}
							}
						}
						if (h > 0) {
							v = a(w.viewId, t, r);
							Ext.DomHelper.append(v, {
								tag : "td",
								cls : "ext-cal-ev-more",
								id : "ext-cal-ev-more-" + k.format("Ymd"),
								cn : {
									tag : "a",
									html : String.format(w.getMoreText(h), h)
								}
							})
						} else {
							if (f < w.evtMaxCount[t]) {
								v = a(w.viewId, t, f);
								if (v) {
									l = {
										tag : "td",
										cls : "ext-cal-ev",
										html : z,
										id : w.viewId + "-empty-" + (f + 1)
												+ "-day-" + n
									};
									var x = w.evtMaxCount[t] - f;
									if (x > 1) {
										l.rowspan = x
									}
									Ext.DomHelper.append(v, l)
								}
							}
						}
					} else {
						v = a(w.viewId, t, 0);
						if (v) {
							l = {
								tag : "td",
								cls : "ext-cal-ev",
								html : z,
								id : w.viewId + "-empty-day-" + n
							};
							if (w.evtMaxCount[t] > 1) {
								l.rowspan = w.evtMaxCount[t]
							}
							Ext.DomHelper.append(v, l)
						}
					}
					k = k.add(Date.DAY, 1)
				}
			}
		}
	}
}();
Ext.ensible.cal.CalendarCombo = Ext
		.extend(
				Ext.form.ComboBox,
				{
					fieldLabel : "Calendar",
					triggerAction : "all",
					mode : "local",
					forceSelection : true,
					selectOnFocus : true,
					width : 200,
					defaultCls : "x-cal-default",
					initComponent : function() {
						var a = Ext.ensible.cal, b = a.CalendarMappings;
						a.CalendarCombo.superclass.initComponent.call(this);
						this.valueField = b.CalendarId.name;
						this.displayField = b.Title.name;
						this.tpl = this.tpl
								|| '<tpl for="."><div class="x-combo-list-item x-cal-{'
								+ b.ColorId.name
								+ '}"><div class="ext-cal-picker-icon">&#160;</div>{'
								+ this.displayField + "}</div></tpl>"
					},
					afterRender : function() {
						Ext.ensible.cal.CalendarCombo.superclass.afterRender
								.call(this);
						this.wrap = this.el.up(".x-form-field-wrap");
						this.wrap.addClass("ext-calendar-picker");
						this.icon = Ext.DomHelper.append(this.wrap, {
							tag : "div",
							cls : "ext-cal-picker-icon ext-cal-picker-mainicon"
						})
					},
					assertValue : function() {
						var b = this.getRawValue(), a = this.findRecord(
								this.displayField, b);
						if (!a && this.forceSelection) {
							if (b.length > 0 && b != this.emptyText) {
								this.store.clearFilter();
								this.setValue(this.value);
								this.applyEmptyText()
							} else {
								this.clearValue()
							}
						} else {
							if (a) {
								if (b == a.get(this.displayField)
										&& this.value == a.get(this.valueField)) {
									return
								}
								b = a.get(this.valueField || this.displayField)
							}
							this.setValue(b)
						}
					},
					getStyleClass : function(a) {
						if (a && a !== "") {
							var b = this.store.getById(a);
							return "x-cal-2"
									//+ b.data[Ext.ensible.cal.CalendarMappings.ColorId.name]
						}
					},
					setValue : function(a) {
						this.wrap.removeClass(this.getStyleClass(this
								.getValue()));
						a = a
								|| this.store.getAt(0).data[Ext.ensible.cal.CalendarMappings.CalendarId.name];
						Ext.ensible.cal.CalendarCombo.superclass.setValue.call(
								this, a);
						this.wrap.addClass(this.getStyleClass(a))
					}
				});
Ext.reg("extensible.calendarcombo", Ext.ensible.cal.CalendarCombo);
Ext.ensible.cal.RecurrenceCombo = Ext.extend(Ext.form.ComboBox, {
	width : 160,
	fieldLabel : "Repeats",
	mode : "local",
	triggerAction : "all",
	forceSelection : true,
	displayField : "pattern",
	valueField : "id",
	recurrenceText : {
		none : "Does not repeat",
		daily : "Daily",
		weekly : "Weekly",
		monthly : "Monthly",
		yearly : "Yearly"
	},
	initComponent : function() {
		Ext.ensible.cal.RecurrenceCombo.superclass.initComponent.call(this);
		this.addEvents("recurrencechange");
		this.store = this.store
				|| new Ext.data.ArrayStore({
					fields : [ "id", "pattern" ],
					idIndex : 0,
					data : [ [ "NONE", this.recurrenceText.none ],
							[ "DAILY", this.recurrenceText.daily ],
							[ "WEEKLY", this.recurrenceText.weekly ],
							[ "MONTHLY", this.recurrenceText.monthly ],
							[ "YEARLY", this.recurrenceText.yearly ] ]
				})
	},
	initValue : function() {
		Ext.ensible.cal.RecurrenceCombo.superclass.initValue.call(this);
		if (this.value != undefined) {
			this.fireEvent("recurrencechange", this.value)
		}
	},
	setValue : function(b) {
		var a = this.value;
		Ext.ensible.cal.RecurrenceCombo.superclass.setValue.call(this, b);
		if (a != b) {
			this.fireEvent("recurrencechange", b)
		}
		return this
	}
});
Ext.reg("extensible.recurrencecombo", Ext.ensible.cal.RecurrenceCombo);
Ext.ensible.cal.RecurrenceField = Ext
		.extend(
				Ext.form.Field,
				{
					fieldLabel : "Repeats",
					startDate : new Date().clearTime(),
					enableFx : true,
					initComponent : function() {
						Ext.ensible.cal.RecurrenceField.superclass.initComponent
								.call(this);
						if (!this.height) {
							this.autoHeight = true
						}
					},
					onRender : function(b, a) {
						if (!this.el) {
							this.frequencyCombo = new Ext.ensible.cal.RecurrenceCombo(
									{
										id : this.id + "-frequency",
										listeners : {
											recurrencechange : {
												fn : this.showOptions,
												scope : this
											}
										}
									});
							if (this.fieldLabel) {
								this.frequencyCombo.fieldLabel = this.fieldLabel
							}
							this.innerCt = new Ext.Container({
								cls : "extensible-recur-inner-ct",
								items : []
							});
							this.fieldCt = new Ext.Container({
								autoEl : {
									id : this.id
								},
								cls : "extensible-recur-ct",
								renderTo : b,
								items : [ this.frequencyCombo, this.innerCt ]
							});
							this.fieldCt.ownerCt = this;
							this.innerCt.ownerCt = this.fieldCt;
							this.el = this.fieldCt.getEl();
							this.items = new Ext.util.MixedCollection();
							this.items.addAll(this.initSubComponents())
						}
						Ext.ensible.cal.RecurrenceField.superclass.onRender
								.call(this, b, a)
					},
					initValue : function() {
						this.setStartDate(this.startDate);
						if (this.value !== undefined) {
							this.setValue(this.value)
						} else {
							if (this.frequency !== undefined) {
								this.setValue("FREQ=" + this.frequency)
							} else {
								this.setValue("NONE")
							}
						}
						this.originalValue = this.getValue()
					},
					showOptions : function(c) {
						var b = false, a = "day";
						if (c != "NONE") {
							this.hideSubPanels()
						}
						this.frequency = c;
						switch (c) {
						case "DAILY":
							b = this.showSubPanel(this.repeatEvery);
							b |= this.showSubPanel(this.until);
							break;
						case "WEEKLY":
							b = this.showSubPanel(this.repeatEvery);
							b |= this.showSubPanel(this.weekly);
							b |= this.showSubPanel(this.until);
							a = "week";
							break;
						case "MONTHLY":
							b = this.showSubPanel(this.repeatEvery);
							b |= this.showSubPanel(this.monthly);
							b |= this.showSubPanel(this.until);
							a = "month";
							break;
						case "YEARLY":
							b = this.showSubPanel(this.repeatEvery);
							b |= this.showSubPanel(this.yearly);
							b |= this.showSubPanel(this.until);
							a = "year";
							break;
						default:
							this.hideInnerCt();
							return
						}
						if (b) {
							this.innerCt.doLayout()
						}
						this.showInnerCt();
						this.repeatEvery.updateLabel(a)
					},
					showSubPanel : function(a) {
						if (a.rendered) {
							a.show();
							return false
						} else {
							if (this.repeatEvery.rendered) {
								a = this.innerCt.insert(1, a)
							} else {
								a = this.innerCt.add(a)
							}
							a.show();
							return true
						}
					},
					showInnerCt : function() {
						if (!this.innerCt.isVisible()) {
							if (this.enableFx && Ext.enableFx) {
								this.innerCt.getPositionEl().slideIn("t", {
									duration : 0.3
								})
							} else {
								this.innerCt.show()
							}
						}
					},
					hideInnerCt : function() {
						if (this.innerCt.isVisible()) {
							if (this.enableFx && Ext.enableFx) {
								this.innerCt.getPositionEl().slideOut("t", {
									duration : 0.3,
									easing : "easeIn",
									callback : this.hideSubPanels,
									scope : this
								})
							} else {
								this.innerCt.hide();
								this.hideSubPanels()
							}
						}
					},
					setStartDate : function(a) {
						this.items.each(function(b) {
							b.setStartDate(a)
						})
					},
					getValue : function() {
						if (!this.rendered) {
							return this.value
						}
						if (this.frequency == "NONE") {
							return ""
						}
						var a = "FREQ=" + this.frequency;
						this.items.each(function(b) {
							if (b.isVisible()) {
								a += b.getValue()
							}
						});
						return a
					},
					setValue : function(a) {
						this.value = a;
						if (a == null || a == "" || a == "NONE") {
							this.frequencyCombo.setValue("NONE");
							this.showOptions("NONE");
							return this
						}
						var b = a.split(";");
						this.items.each(function(c) {
							c.setValue(b)
						});
						Ext.each(b, function(e) {
							if (e.indexOf("FREQ") > -1) {
								var c = e.split("=")[1];
								this.frequencyCombo.setValue(c);
								this.showOptions(c);
								return
							}
						}, this);
						return this
					},
					hideSubPanels : function() {
						this.items.each(function(a) {
							a.hide()
						})
					},
					initSubComponents : function() {
						Ext.ensible.cal.recurrenceBase = Ext
								.extend(
										Ext.Container,
										{
											fieldLabel : " ",
											labelSeparator : "",
											hideLabel : true,
											layout : "table",
											anchor : "100%",
											startDate : this.startDate,
											getSuffix : function(a) {
												if (!Ext.isNumber(a)) {
													return ""
												}
												switch (a) {
												case 1:
												case 21:
												case 31:
													return "st";
												case 2:
												case 22:
													return "nd";
												case 3:
												case 23:
													return "rd";
												default:
													return "th"
												}
											},
											initNthCombo : function(i) {
												var i = Ext.getCmp(this.id
														+ "-combo"), b = this.startDate, n = i
														.getStore(), o = b
														.getLastDateOfMonth()
														.getDate(), c = b
														.getDate(), p = b
														.format("jS")
														+ " day", h = this.id
														.indexOf("-yearly") > -1, l = " in "
														+ b.format("F"), g, e, k, a, m, f, q;
												g = Math.ceil(c / 7);
												e = g + this.getSuffix(g)
														+ b.format(" l");
												if (h) {
													p += l;
													e += l
												}
												f = [ [ p ], [ e ] ];
												q = h ? l : "";
												if (o - c < 7) {
													f
															.push([ "last "
																	+ b
																			.format("l")
																	+ q ])
												}
												if (o == c) {
													f.push([ "last day" + q ])
												}
												m = n.find("field1", i
														.getValue());
												n.removeAll();
												i.clearValue();
												n.loadData(f);
												if (m > f.length - 1) {
													m = f.length - 1
												}
												i.setValue(n.getAt(m > -1 ? m
														: 0).data.field1);
												return this
											},
											setValue : Ext.emptyFn
										});
						this.repeatEvery = new Ext.ensible.cal.recurrenceBase(
								{
									id : this.id + "-every",
									layoutConfig : {
										columns : 3
									},
									items : [
											{
												xtype : "label",
												text : "Repeat every"
											},
											{
												xtype : "numberfield",
												id : this.id + "-every-num",
												value : 1,
												width : 35,
												minValue : 1,
												maxValue : 99,
												allowBlank : false,
												enableKeyEvents : true,
												listeners : {
													keyup : {
														fn : function() {
															this.repeatEvery
																	.updateLabel()
														},
														scope : this
													}
												}
											}, {
												xtype : "label",
												id : this.id + "-every-label"
											} ],
									setStartDate : function(a) {
										this.startDate = a;
										this.updateLabel();
										return this
									},
									getValue : function() {
										var a = Ext.getCmp(this.id + "-num")
												.getValue();
										return a > 1 ? ";INTERVAL=" + a : ""
									},
									setValue : function(a) {
										var c = false, b = Ext.isArray(a) ? a
												: a.split(";");
										Ext.each(b, function(f) {
											if (f.indexOf("INTERVAL") > -1) {
												var e = f.split("=")[1];
												Ext.getCmp(this.id + "-num")
														.setValue(e)
											}
										}, this);
										return this
									},
									updateLabel : function(b) {
										if (this.rendered) {
											var a = Ext
													.getCmp(this.id + "-num")
													.getValue() == 1 ? "" : "s";
											this.type = b ? b.toLowerCase()
													: this.type || "day";
											var c = Ext.getCmp(this.id
													+ "-label");
											if (c.rendered) {
												c
														.update(this.type
																+ a
																+ " beginning "
																+ this.startDate
																		.format("l, F j"))
											}
										}
										return this
									},
									afterRender : function() {
										Ext.ensible.cal.recurrenceBase.superclass.afterRender
												.call(this);
										this.updateLabel()
									}
								});
						this.weekly = new Ext.ensible.cal.recurrenceBase({
							id : this.id + "-weekly",
							layoutConfig : {
								columns : 2
							},
							items : [ {
								xtype : "label",
								text : "on:"
							}, {
								xtype : "checkboxgroup",
								id : this.id + "-weekly-days",
								items : [ {
									boxLabel : "Sun",
									name : "SU",
									id : this.id + "-weekly-SU"
								}, {
									boxLabel : "Mon",
									name : "MO",
									id : this.id + "-weekly-MO"
								}, {
									boxLabel : "Tue",
									name : "TU",
									id : this.id + "-weekly-TU"
								}, {
									boxLabel : "Wed",
									name : "WE",
									id : this.id + "-weekly-WE"
								}, {
									boxLabel : "Thu",
									name : "TH",
									id : this.id + "-weekly-TH"
								}, {
									boxLabel : "Fri",
									name : "FR",
									id : this.id + "-weekly-FR"
								}, {
									boxLabel : "Sat",
									name : "SA",
									id : this.id + "-weekly-SA"
								} ]
							} ],
							setStartDate : function(a) {
								this.startDate = a;
								this.selectToday();
								return this
							},
							selectToday : function() {
								this.clearValue();
								var a = this.startDate.format("D").substring(0,
										2).toUpperCase();
								Ext.getCmp(this.id + "-days").setValue(a, true)
							},
							clearValue : function() {
								Ext.getCmp(this.id + "-days").setValue(
										[ false, false, false, false, false,
												false, false ])
							},
							getValue : function() {
								var b = "", c = Ext.getCmp(this.id + "-days")
										.getValue();
								Ext.each(c, function(e) {
									if (b.length > 0) {
										b += ","
									}
									b += e.name
								});
								var a = this.startDate.format("D").substring(0,
										2).toUpperCase();
								return b.length > 0 && b != a ? ";BYDAY=" + b
										: ""
							},
							setValue : function(a) {
								var c = false, b = Ext.isArray(a) ? a : a
										.split(";");
								this.clearValue();
								Ext.each(b,
										function(f) {
											if (f.indexOf("BYDAY") > -1) {
												var g = f.split("=")[1]
														.split(","), e = {};
												Ext.each(g, function(h) {
													e[h] = true
												}, this);
												Ext.getCmp(this.id + "-days")
														.setValue(e);
												return c = true
											}
										}, this);
								if (!c) {
									this.selectToday()
								}
								return this
							}
						});
						this.monthly = new Ext.ensible.cal.recurrenceBase({
							id : this.id + "-monthly",
							layoutConfig : {
								columns : 3
							},
							items : [ {
								xtype : "label",
								text : "on the"
							}, {
								xtype : "combo",
								id : this.id + "-monthly-combo",
								mode : "local",
								width : 150,
								triggerAction : "all",
								forceSelection : true,
								store : []
							}, {
								xtype : "label",
								text : "of each month"
							} ],
							setStartDate : function(a) {
								this.startDate = a;
								this.initNthCombo();
								return this
							},
							getValue : function() {
								var f = Ext.getCmp(this.id + "-combo"), c = f
										.getStore(), a = c.find("field1", f
										.getValue()), e = this.startDate, b = e
										.format("D").substring(0, 2)
										.toUpperCase();
								if (a > -1) {
									switch (a) {
									case 0:
										return ";BYMONTHDAY=" + e.format("j");
									case 1:
										return ";BYDAY="
												+ f.getValue()[0].substring(0,
														1) + b;
									case 2:
										return ";BYDAY=-1" + b;
									default:
										return ";BYMONTHDAY=-1"
									}
								}
								return ""
							}
						});
						this.yearly = new Ext.ensible.cal.recurrenceBase({
							id : this.id + "-yearly",
							layoutConfig : {
								columns : 3
							},
							items : [ {
								xtype : "label",
								text : "on the"
							}, {
								xtype : "combo",
								id : this.id + "-yearly-combo",
								mode : "local",
								width : 170,
								triggerAction : "all",
								forceSelection : true,
								store : []
							}, {
								xtype : "label",
								text : "each year"
							} ],
							setStartDate : function(a) {
								this.startDate = a;
								this.initNthCombo();
								return this
							},
							getValue : function() {
								var f = Ext.getCmp(this.id + "-combo"), c = f
										.getStore(), a = c.find("field1", f
										.getValue()), e = this.startDate, b = e
										.format("D").substring(0, 2)
										.toUpperCase(), g = ";BYMONTH="
										+ e.format("n");
								if (a > -1) {
									switch (a) {
									case 0:
										return g;
									case 1:
										return g
												+ ";BYDAY="
												+ f.getValue()[0].substring(0,
														1) + b;
									case 2:
										return g + ";BYDAY=-1" + b;
									default:
										return g + ";BYMONTHDAY=-1"
									}
								}
								return ""
							}
						});
						this.until = new Ext.ensible.cal.recurrenceBase(
								{
									id : this.id + "-until",
									untilDateFormat : "Ymd\\T000000\\Z",
									layoutConfig : {
										columns : 5
									},
									items : [
											{
												xtype : "label",
												text : "and continuing"
											},
											{
												xtype : "combo",
												id : this.id + "-until-combo",
												mode : "local",
												width : 85,
												triggerAction : "all",
												forceSelection : true,
												value : "forever",
												store : [ "forever", "for",
														"until" ],
												listeners : {
													select : {
														fn : function(b, c) {
															var a = Ext
																	.getCmp(this.id
																			+ "-until-date");
															if (c.data.field1 == "until") {
																a.show();
																if (a
																		.getValue() == "") {
																	a
																			.setValue(this.startDate
																					.add(
																							Date.DAY,
																							5));
																	a
																			.setMinValue(this.startDate
																					.clone()
																					.add(
																							Date.DAY,
																							1))
																}
															} else {
																a.hide()
															}
															if (c.data.field1 == "for") {
																Ext
																		.getCmp(
																				this.id
																						+ "-until-num")
																		.show();
																Ext
																		.getCmp(
																				this.id
																						+ "-until-endlabel")
																		.show()
															} else {
																Ext
																		.getCmp(
																				this.id
																						+ "-until-num")
																		.hide();
																Ext
																		.getCmp(
																				this.id
																						+ "-until-endlabel")
																		.hide()
															}
														},
														scope : this
													}
												}
											},
											{
												xtype : "datefield",
												id : this.id + "-until-date",
												showToday : false,
												hidden : true
											},
											{
												xtype : "numberfield",
												id : this.id + "-until-num",
												value : 5,
												width : 35,
												minValue : 1,
												maxValue : 99,
												allowBlank : false,
												hidden : true
											},
											{
												xtype : "label",
												id : this.id
														+ "-until-endlabel",
												text : "occurrences",
												hidden : true
											} ],
									setStartDate : function(a) {
										this.startDate = a;
										return this
									},
									getValue : function() {
										var b = Ext.getCmp(this.id + "-date");
										if (b.isVisible()) {
											return ";UNTIL="
													+ b
															.getValue()
															.format(
																	this.untilDateFormat)
										}
										var a = Ext.getCmp(this.id + "-num");
										if (a.isVisible()) {
											return ";COUNT=" + a.getValue()
										}
										return ""
									},
									setValue : function(a) {
										var c = false, b = Ext.isArray(a) ? a
												: a.split(";");
										Ext
												.each(
														b,
														function(g) {
															if (g
																	.indexOf("COUNT") > -1) {
																var f = g
																		.split("=")[1];
																Ext
																		.getCmp(
																				this.id
																						+ "-combo")
																		.setValue(
																				"for");
																Ext
																		.getCmp(
																				this.id
																						+ "-num")
																		.setValue(
																				f)
																		.show();
																Ext
																		.getCmp(
																				this.id
																						+ "-endlabel")
																		.show()
															} else {
																if (g
																		.indexOf("UNTIL") > -1) {
																	var e = g
																			.split("=")[1];
																	Ext
																			.getCmp(
																					this.id
																							+ "-combo")
																			.setValue(
																					"until");
																	Ext
																			.getCmp(
																					this.id
																							+ "-date")
																			.setValue(
																					Date
																							.parseDate(
																									e,
																									this.untilDateFormat))
																			.show();
																	Ext
																			.getCmp(
																					this.id
																							+ "-endlabel")
																			.hide()
																}
															}
														}, this);
										return this
									}
								});
						return [ this.repeatEvery, this.weekly, this.monthly,
								this.yearly, this.until ]
					}
				});
Ext.reg("extensible.recurrencefield", Ext.ensible.cal.RecurrenceField);
Ext.ensible.cal.DateRangeField = Ext
		.extend(
				Ext.form.Field,
				{
					toText : "to",
					allDayText : "All day",
					singleLine : "auto",
					singleLineMinWidth : 490,
					dateFormat : "n/j/Y",
					timeFormat : Ext.ensible.Date.use24HourTime ? "G:i"
							: "g:i A",
					onRender : function(e, b) {
						if (!this.el) {
							this.startDate = new Ext.form.DateField({
								id : this.id + "-start-date",
								format : this.dateFormat,
								width : 100,
								listeners : {
									change : {
										fn : function() {
											this.onFieldChange("date", "start")
										},
										scope : this
									}
								}
							});
							this.startTime = new Ext.form.TimeField({
								id : this.id + "-start-time",
								hidden : this.showTimes === false,
								labelWidth : 0,
								hideLabel : true,
								width : 90,
								format : this.timeFormat,
								listeners : {
									select : {
										fn : function() {
											this.onFieldChange("time", "start")
										},
										scope : this
									}
								}
							});
							this.endTime = new Ext.form.TimeField({
								id : this.id + "-end-time",
								hidden : this.showTimes === false,
								labelWidth : 0,
								hideLabel : true,
								width : 90,
								format : this.timeFormat,
								listeners : {
									select : {
										fn : function() {
											this.onFieldChange("time", "end")
										},
										scope : this
									}
								}
							});
							this.endDate = new Ext.form.DateField({
								id : this.id + "-end-date",
								format : this.dateFormat,
								hideLabel : true,
								width : 100,
								listeners : {
									change : {
										fn : function() {
											this.onFieldChange("date", "end")
										},
										scope : this
									}
								}
							});
							this.allDay = new Ext.form.Checkbox({
								id : this.id + "-allday",
								hidden : this.showTimes === false
										|| this.showAllDay === false,
								boxLabel : this.allDayText,
								handler : function(g, h) {
									this.startTime.setVisible(!h);
									this.endTime.setVisible(!h)
								},
								scope : this
							});
							this.toLabel = new Ext.form.Label({
								xtype : "label",
								id : this.id + "-to-label",
								text : this.toText
							});
							var a = this.singleLine;
							if (a == "auto") {
								var f, c = this.ownerCt.getWidth()
										- this.ownerCt.getEl().getPadding("lr");
								if (f = this.ownerCt.getEl().child(
										".x-panel-body")) {
									c -= f.getPadding("lr")
								}
								if (f = this.ownerCt.getEl().child(
										".x-form-item-label")) {
									c -= f.getWidth() - f.getPadding("lr")
								}
								a = c <= this.singleLineMinWidth ? false : true
							}
							this.fieldCt = new Ext.Container({
								autoEl : {
									id : this.id
								},
								cls : "ext-dt-range",
								renderTo : e,
								layout : "table",
								layoutConfig : {
									columns : a ? 6 : 3
								},
								defaults : {
									hideParent : true
								},
								items : [ this.startDate, this.startTime,
										this.toLabel,
										a ? this.endTime : this.endDate,
										a ? this.endDate : this.endTime,
										this.allDay ]
							});
							this.fieldCt.ownerCt = this;
							this.el = this.fieldCt.getEl();
							this.items = new Ext.util.MixedCollection();
							this.items.addAll([ this.startDate, this.endDate,
									this.toLabel, this.startTime, this.endTime,
									this.allDay ])
						}
						Ext.ensible.cal.DateRangeField.superclass.onRender
								.call(this, e, b);
						if (!a) {
							this.el.child("tr").addClass("ext-dt-range-row1")
						}
					},
					onFieldChange : function(a, b) {
						this.checkDates(a, b);
						this.fireEvent("change", this, this.getValue())
					},
					checkDates : function(f, g) {
						var e = Ext.getCmp(this.id + "-start-" + f), b = Ext
								.getCmp(this.id + "-end-" + f), c = this
								.getDT("start"), a = this.getDT("end");
						if (c > a) {
							if (g == "start") {
								b.setValue(c)
							} else {
								e.setValue(a);
								this.checkDates(f, "start")
							}
						}
						if (f == "date") {
							this.checkDates("time", g)
						}
					},
					getValue : function() {
						return [ this.getDT("start"), this.getDT("end"),
								this.allDay.getValue() ]
					},
					getDT : function(c) {
						var b = this[c + "Time"].getValue(), a = this[c
								+ "Date"].getValue();
						if (Ext.isDate(a)) {
							a = a.format(this[c + "Date"].format)
						} else {
							return null
						}
						if (b != "") {
							return Date.parseDate(a + " " + b,
									this[c + "Date"].format + " "
											+ this[c + "Time"].format)
						}
						return Date.parseDate(a, this[c + "Date"].format)
					},
					setValue : function(a) {
						if (Ext.isArray(a)) {
							this.setDT(a[0], "start");
							this.setDT(a[1], "end");
							this.allDay.setValue(!!a[2])
						} else {
							if (Ext.isDate(a)) {
								this.setDT(a, "start");
								this.setDT(a, "end");
								this.allDay.setValue(false)
							} else {
								if (a[Ext.ensible.cal.EventMappings.StartDate.name]) {
									this
											.setDT(
													a[Ext.ensible.cal.EventMappings.StartDate.name],
													"start");
									if (!this
											.setDT(
													a[Ext.ensible.cal.EventMappings.EndDate.name],
													"end")) {
										this
												.setDT(
														a[Ext.ensible.cal.EventMappings.StartDate.name],
														"end")
									}
									this.allDay
											.setValue(!!a[Ext.ensible.cal.EventMappings.IsAllDay.name])
								}
							}
						}
					},
					setDT : function(a, b) {
						if (a && Ext.isDate(a)) {
							this[b + "Date"].setValue(a);
							this[b + "Time"].setValue(a
									.format(this[b + "Time"].format));
							return true
						}
					},
					isDirty : function() {
						var a = false;
						if (this.rendered && !this.disabled) {
							this.items.each(function(b) {
								if (b.isDirty()) {
									a = true;
									return false
								}
							})
						}
						return a
					},
					onDisable : function() {
						this.delegateFn("disable")
					},
					onEnable : function() {
						this.delegateFn("enable")
					},
					reset : function() {
						this.delegateFn("reset")
					},
					delegateFn : function(a) {
						this.items.each(function(b) {
							if (b[a]) {
								b[a]()
							}
						})
					},
					beforeDestroy : function() {
						Ext.destroy(this.fieldCt);
						Ext.ensible.cal.DateRangeField.superclass.beforeDestroy
								.call(this)
					},
					getRawValue : Ext.emptyFn,
					setRawValue : Ext.emptyFn
				});
Ext.reg("extensible.daterangefield", Ext.ensible.cal.DateRangeField);
Ext.ensible.cal.ReminderField = Ext.extend(Ext.form.ComboBox, {
	width : 200,
	fieldLabel : "Reminder",
	mode : "local",
	triggerAction : "all",
	forceSelection : true,
	displayField : "desc",
	valueField : "value",
	noneText : "None",
	atStartTimeText : "At start time",
	reminderValueFormat : "{0} {1} before start",
	minutesText : "minutes",
	hourText : "hour",
	hoursText : "hours",
	dayText : "day",
	daysText : "days",
	weekText : "week",
	weeksText : "weeks",
	getValueList : function() {
		var c = this, a = c.reminderValueFormat, b = String.format;
		return [ [ "", c.noneText ], [ "0", c.atStartTimeText ],
				[ "5", b(a, "5", c.getMinutesText(5)) ],
				[ "15", b(a, "15", c.getMinutesText(15)) ],
				[ "30", b(a, "30", c.getMinutesText(30)) ],
				[ "60", b(a, "1", c.getHoursText(1)) ],
				[ "90", b(a, "1.5", c.getHoursText(1.5)) ],
				[ "120", b(a, "2", c.getHoursText(2)) ],
				[ "180", b(a, "3", c.getHoursText(3)) ],
				[ "360", b(a, "6", c.getHoursText(6)) ],
				[ "720", b(a, "12", c.getHoursText(12)) ],
				[ "1440", b(a, "1", c.getDaysText(1)) ],
				[ "2880", b(a, "2", c.getDaysText(2)) ],
				[ "4320", b(a, "3", c.getDaysText(3)) ],
				[ "5760", b(a, "4", c.getDaysText(4)) ],
				[ "7200", b(a, "5", c.getDaysText(5)) ],
				[ "10080", b(a, "1", c.getWeeksText(1)) ],
				[ "20160", b(a, "2", c.getWeeksText(2)) ] ]
	},
	getMinutesText : function(a) {
		return a === 1 ? this.minuteText : this.minutesText
	},
	getHoursText : function(a) {
		return a === 1 ? this.hourText : this.hoursText
	},
	getDaysText : function(a) {
		return a === 1 ? this.dayText : this.daysText
	},
	getWeeksText : function(a) {
		return a === 1 ? this.weekText : this.weeksText
	},
	initComponent : function() {
		Ext.ensible.cal.ReminderField.superclass.initComponent.call(this);
		this.store = this.store || new Ext.data.ArrayStore({
			fields : [ this.valueField, this.displayField ],
			idIndex : 0,
			data : this.getValueList()
		})
	},
	initValue : function() {
		if (this.value !== undefined) {
			this.setValue(this.value)
		} else {
			this.setValue("")
		}
		this.originalValue = this.getValue()
	}
});
Ext.reg("extensible.reminderfield", Ext.ensible.cal.ReminderField);
Ext.ensible.cal.ColorPalette = Ext
		.extend(
				Ext.ColorPalette,
				{
					colorCount : 32,
					initComponent : function() {
						Ext.ensible.cal.ColorPalette.superclass.initComponent
								.call(this);
						this.addClass("x-calendar-palette");
						this.tpl = new Ext.XTemplate(
								'<tpl for="."><a class="x-unselectable x-cal-color" id="'
										+ this.id
										+ '-color-{.}" href="#" hidefocus="on"><em><span class="x-cal-{.}">&#160;</span></em></a></tpl>');
						if (this.handler) {
							this.on("select", this.handler, this.scope || this)
						}
						this.colors = [];
						for ( var a = 1; a <= this.colorCount; a++) {
							this.colors.push(a)
						}
					},
					handleClick : function(c, a) {
						c.preventDefault();
						var b = c.getTarget(".x-cal-color", 3, true);
						if (b) {
							var f = b.id.split("-color-")[1];
							this.select(f)
						}
					},
					select : function(b, a) {
						if (b != this.value) {
							if (this.value) {
								Ext.fly(this.id + "-color-" + this.value)
										.removeClass("x-color-palette-sel")
							}
							Ext.get(this.id + "-color-" + b).addClass(
									"x-color-palette-sel");
							this.value = b;
							if (a !== true) {
								this.fireEvent("select", this, b)
							}
						}
					}
				});
Ext.reg("extensible.calendarcolorpalette", Ext.ensible.cal.ColorPalette);
Ext.ensible.cal.CalendarListMenu = Ext.extend(Ext.menu.Menu, {
	hideOnClick : true,
	ignoreParentClicks : true,
	cls : "x-calendar-list-menu",
	displayOnlyThisCalendarText : "Display only this calendar",
	enableScrolling : false,
	initComponent : function() {
		this.addEvents("showcalendar", "hidecalendar", "radiocalendar",
				"colorchange");
		Ext.apply(this, {
			items : [ {
				text : this.displayOnlyThisCalendarText,
				iconCls : "extensible-cal-icon-cal-show",
				handler : this.handleRadioCalendarClick.createDelegate(this)
			}, "-", {
				xtype : "extensible.calendarcolorpalette",
				handler : this.handleColorSelect.createDelegate(this)
			} ]
		});
		Ext.ensible.cal.CalendarListMenu.superclass.initComponent.call(this)
	},
	afterRender : function() {
		Ext.ensible.cal.CalendarListMenu.superclass.afterRender.call(this);
		this.palette = this.findByType("extensible.calendarcolorpalette")[0];
		if (this.colorId) {
			this.palette.select(this.colorId, true)
		}
	},
	handleRadioCalendarClick : function(b, a) {
		this.fireEvent("radiocalendar", this, this.calendarId)
	},
	handleColorSelect : function(b, a) {
		this.fireEvent("colorchange", this, this.calendarId, a, this.colorId);
		this.colorId = a;
		this.menuHide()
	},
	setCalendar : function(b, a) {
		this.calendarId = b;
		this.colorId = a;
		if (this.rendered) {
			this.palette.select(a, true)
		}
		return this
	},
	menuHide : function() {
		if (this.hideOnClick) {
			this.hide(true)
		}
	}
});
Ext.reg("extensible.calendarlistmenu", Ext.ensible.cal.CalendarListMenu);
Ext.ensible.cal.EventContextMenu = Ext
		.extend(
				Ext.menu.Menu,
				{
					hideOnClick : true,
					ignoreParentClicks : true,
					editDetailsText : "Edit Details",
					deleteText : "Delete",
					moveToText : "Move to...",
					enableScrolling : false,
					initComponent : function() {
						this.addEvents("editdetails", "eventdelete",
								"eventmove");
						this.buildMenu();
						Ext.ensible.cal.CalendarListMenu.superclass.initComponent
								.call(this)
					},
					buildMenu : function() {
						if (this.rendered) {
							return
						}
						this.dateMenu = new Ext.menu.DateMenu(
								{
									scope : this,
									handler : function(b, a) {
										a = Ext.ensible.Date
												.copyTime(
														this.rec.data[Ext.ensible.cal.EventMappings.StartDate.name],
														a);
										this.fireEvent("eventmove", this,
												this.rec, a)
									}
								});
						Ext
								.apply(
										this,
										{
											items : [
													{
														text : this.editDetailsText,
														iconCls : "extensible-cal-icon-evt-edit",
														scope : this,
														handler : function() {
															this
																	.fireEvent(
																			"editdetails",
																			this,
																			this.rec,
																			this.ctxEl)
														}
													},
													{
														text : this.deleteText,
														iconCls : "extensible-cal-icon-evt-del",
														scope : this,
														handler : function() {
															this
																	.fireEvent(
																			"eventdelete",
																			this,
																			this.rec,
																			this.ctxEl)
														}
													},
													"-",
													{
														text : this.moveToText,
														iconCls : "extensible-cal-icon-evt-move",
														menu : this.dateMenu
													} ]
										})
					},
					showForEvent : function(c, a, b) {
						this.rec = c;
						this.ctxEl = a;
						this.dateMenu.picker
								.setValue(c.data[Ext.ensible.cal.EventMappings.StartDate.name]);
						this.showAt(b)
					},
					onHide : function() {
						Ext.ensible.cal.CalendarListMenu.superclass.onHide
								.call(this);
						delete this.ctxEl
					}
				});
Ext.reg("extensible.eventcontextmenu", Ext.ensible.cal.EventContextMenu);
Ext.ensible.cal.CalendarList = Ext
		.extend(
				Ext.Panel,
				{
					title : "Calendars",
					collapsible : true,
					autoHeight : true,
					layout : "fit",
					menuSelector : "em",
					width : 100,
					initComponent : function() {
						this.addClass("x-calendar-list");
						Ext.ensible.cal.CalendarList.superclass.initComponent
								.call(this)
					},
					afterRender : function(b, a) {
						Ext.ensible.cal.CalendarList.superclass.afterRender
								.call(this);
						if (this.store) {
							this.setStore(this.store, true)
						}
						this.refresh();
						this.body.on("click", this.onClick, this);
						this.body.on("mouseover", this.onMouseOver, this, {
							delegate : "li"
						});
						this.body.on("mouseout", this.onMouseOut, this, {
							delegate : "li"
						})
					},
					getListTemplate : function() {
						if (!this.tpl) {
							this.tpl = !(Ext.isIE || Ext.isOpera) ? new Ext.XTemplate(
									'<ul class="x-unselectable"><tpl for=".">',
									'<li id="{cmpId}" class="ext-cal-evr {colorCls} {hiddenCls}">{title}<em>&#160;</em></li>',
									"</tpl></ul>")
									: new Ext.XTemplate(
											'<ul class="x-unselectable"><tpl for=".">',
											'<li id="{cmpId}" class="ext-cal-evo {colorCls} {hiddenCls}">',
											'<div class="ext-cal-evm">',
											'<div class="ext-cal-evi">{title}<em>&#160;</em></div>',
											"</div>", "</li>", "</tpl></ul>");
							this.tpl.compile()
						}
						return this.tpl
					},
					setStore : function(a, b) {
						if (!b && this.store) {
							this.store.un("load", this.refresh, this);
							this.store.un("add", this.refresh, this);
							this.store.un("remove", this.refresh, this);
							this.store.un("update", this.onUpdate, this);
							this.store.un("clear", this.refresh, this)
						}
						if (a) {
							a.on("load", this.refresh, this);
							a.on("add", this.refresh, this);
							a.on("remove", this.refresh, this);
							a.on("update", this.onUpdate, this);
							a.on("clear", this.refresh, this)
						}
						this.store = a
					},
					onUpdate : function(b, c, a) {
						if (a == Ext.data.Record.COMMIT) {
							this.refresh()
						}
					},
					refresh : function() {
						if (this.skipRefresh) {
							return
						}
						var f = [], c = 0, g = null, b = Ext.ensible.cal.CalendarMappings, e = this.store
								.getRange(), a = e.length;
						for (; c < a; c++) {
							g = {
								cmpId : this.id + "__"
										+ e[c].data[b.CalendarId.name],
								title : e[c].data[b.Title.name],
								colorCls : this
										.getColorCls(e[c].data[b.ColorId.name])
							};
							if (e[c].data[b.IsHidden.name] === true) {
								g.hiddenCls = "ext-cal-hidden"
							}
							f[f.length] = g
						}
						this.getListTemplate().overwrite(this.body, f)
					},
					getColorCls : function(a) {
						return "x-cal-" + a + "-ad"
					},
					toggleCalendar : function(f, e) {
						var c = this.store.getById(f), a = Ext.ensible.cal.CalendarMappings, b = c.data[a.IsHidden.name];
						c.set([ a.IsHidden.name ], !b);
						if (e !== false) {
							c.commit()
						}
					},
					showCalendar : function(c, b) {
						var a = this.store.getById(c);
						if (a.data[Ext.ensible.cal.CalendarMappings.IsHidden.name] === true) {
							this.toggleCalendar(c, b)
						}
					},
					hideCalendar : function(c, b) {
						var a = this.store.getById(c);
						if (a.data[Ext.ensible.cal.CalendarMappings.IsHidden.name] !== true) {
							this.toggleCalendar(c, b)
						}
					},
					radioCalendar : function(g) {
						var b = 0, f, c = Ext.ensible.cal.CalendarMappings.CalendarId.name, e = this.store
								.getRange(), a = e.length;
						for (; b < a; b++) {
							f = e[b].data[c];
							if (f == g) {
								this.showCalendar(f, false)
							} else {
								this.hideCalendar(f, false)
							}
						}
						this.skipRefresh = true;
						this.store.commitChanges();
						delete this.skipRefresh;
						this.refresh()
					},
					onMouseOver : function(b, a) {
						Ext.fly(a).addClass("hover")
					},
					onMouseOut : function(b, a) {
						Ext.fly(a).removeClass("hover")
					},
					getCalendarId : function(a) {
						return a.id.split("__")[1]
					},
					getCalendarItemEl : function(a) {
						return Ext.get(this.id + "__" + a)
					},
					onClick : function(c, a) {
						var b;
						if (b = c.getTarget(this.menuSelector, 3, true)) {
							this.showEventMenu(b, c.getXY())
						} else {
							if (b = c.getTarget("li", 3, true)) {
								this.toggleCalendar(this.getCalendarId(b))
							}
						}
					},
					handleColorChange : function(e, f, c, a) {
						var b = this.store.getById(f);
						b.data[Ext.ensible.cal.CalendarMappings.ColorId.name] = c;
						b.commit()
					},
					handleRadioCalendar : function(a, b) {
						this.radioCalendar(b)
					},
					showEventMenu : function(a, b) {
						var f = this.getCalendarId(a.parent("li")), e = this.store
								.getById(f), c = e.data[Ext.ensible.cal.CalendarMappings.ColorId.name];
						if (!this.menu) {
							this.menu = new Ext.ensible.cal.CalendarListMenu();
							this.menu.on("colorchange", this.handleColorChange,
									this);
							this.menu.on("radiocalendar",
									this.handleRadioCalendar, this)
						}
						this.menu.setCalendar(f, c);
						this.menu.showAt(b)
					}
				});
Ext.reg("extensible.calendarlist", Ext.ensible.cal.CalendarList);
Ext.ensible.cal.EventEditForm = Ext
		.extend(
				Ext.form.FormPanel,
				{
					labelWidth : 65,
					labelWidthRightCol : 65,
					colWidthLeft : 0.6,
					colWidthRight : 0.4,
					title : "Event Form",
					titleTextAdd : "Add Event",
					titleTextEdit : "Edit Event",
					titleLabelText : "Title",
					datesLabelText : "When",
					reminderLabelText : "Reminder",
					notesLabelText : "Notes",
					locationLabelText : "Location",
					webLinkLabelText : "Web Link",
					calendarLabelText : "Calendar",
					repeatsLabelText : "Repeats",
					saveButtonText : "Save",
					deleteButtonText : "Delete",
					cancelButtonText : "Cancel",
					bodyStyle : "padding:20px 20px 10px;",
					border : false,
					buttonAlign : "center",
					autoHeight : true,
					enableRecurrence : false,
					layout : "column",
					cls : "ext-evt-edit-form",
					initComponent : function() {
						this.addEvents({
							eventadd : true,
							eventupdate : true,
							eventdelete : true,
							eventcancel : true
						});
						this.titleField = new Ext.form.TextField({
							fieldLabel : this.titleLabelText,
							name : Ext.ensible.cal.EventMappings.Title.name,
							anchor : "90%"
						});
						this.dateRangeField = new Ext.ensible.cal.DateRangeField(
								{
									fieldLabel : this.datesLabelText,
									singleLine : false,
									anchor : "90%",
									listeners : {
										change : this.onDateChange
												.createDelegate(this)
									}
								});
						this.reminderField = new Ext.ensible.cal.ReminderField(
								{
									name : Ext.ensible.cal.EventMappings.Reminder.name,
									fieldLabel : this.reminderLabelText
								});
						this.notesField = new Ext.form.TextArea({
							fieldLabel : this.notesLabelText,
							name : Ext.ensible.cal.EventMappings.Notes.name,
							grow : true,
							growMax : 150,
							anchor : "100%"
						});
						this.locationField = new Ext.form.TextField({
							fieldLabel : this.locationLabelText,
							name : Ext.ensible.cal.EventMappings.Location.name,
							anchor : "100%"
						});
						this.urlField = new Ext.form.TextField({
							fieldLabel : this.webLinkLabelText,
							name : Ext.ensible.cal.EventMappings.Url.name,
							anchor : "100%"
						});
						var a = [ this.titleField, this.dateRangeField,
								this.reminderField ], b = [ this.notesField,
								this.locationField, this.urlField ];
						if (this.enableRecurrence) {
							this.recurrenceField = new Ext.ensible.cal.RecurrenceField(
									{
										name : Ext.ensible.cal.EventMappings.RRule.name,
										fieldLabel : this.repeatsLabelText,
										anchor : "100%"
									});
							a.splice(2, 0, this.recurrenceField)
						}
						if (this.calendarStore) {
							this.calendarField = new Ext.ensible.cal.CalendarCombo(
									{
										store : this.calendarStore,
										fieldLabel : this.calendarLabelText,
										name : Ext.ensible.cal.EventMappings.CalendarId.name
									});
							a.splice(2, 0, this.calendarField)
						}
						this.items = [
								{
									id : this.id + "-left-col",
									columnWidth : this.colWidthLeft,
									layout : "form",
									border : false,
									items : a
								},
								{
									id : this.id + "-right-col",
									columnWidth : this.colWidthRight,
									layout : "form",
									labelWidth : this.labelWidthRightCol
											|| this.labelWidth,
									border : false,
									items : b
								} ];
						this.fbar = [ {
							text : this.saveButtonText,
							scope : this,
							handler : this.onSave
						}, {
							cls : "ext-del-btn",
							text : this.deleteButtonText,
							scope : this,
							handler : this.onDelete
						}, {
							text : this.cancelButtonText,
							scope : this,
							handler : this.onCancel
						} ];
						Ext.ensible.cal.EventEditForm.superclass.initComponent
								.call(this)
					},
					onDateChange : function(a, b) {
						if (this.recurrenceField) {
							this.recurrenceField.setStartDate(b[0])
						}
					},
					loadRecord : function(a) {
						this.form.reset().loadRecord
								.apply(this.form, arguments);
						this.activeRecord = a;
						this.dateRangeField.setValue(a.data);
						if (this.recurrenceField) {
							this.recurrenceField
									.setStartDate(a.data[Ext.ensible.cal.EventMappings.StartDate.name])
						}
						if (this.calendarStore) {
							this.form
									.setValues({
										calendar : a.data[Ext.ensible.cal.EventMappings.CalendarId.name]
									})
						}
						if (a.phantom) {
							this.setTitle(this.titleTextAdd);
							Ext.select(".ext-del-btn").setDisplayed(false)
						} else {
							this.setTitle(this.titleTextEdit);
							Ext.select(".ext-del-btn").setDisplayed(true)
						}
						this.titleField.focus()
					},
					updateRecord : function() {
						var c = this.dateRangeField.getValue(), f = Ext.ensible.cal.EventMappings, e = this.activeRecord, a = e.fields, b = false;
						e.beginEdit();
						a.each(function(h) {
							var i = this.form.findField(h.name);
							if (i) {
								var g = i.getValue();
								if (g.getGroupValue) {
									g = g.getGroupValue()
								} else {
									if (i.eachItem) {
										g = [];
										i.eachItem(function(k) {
											g.push(k.getValue())
										})
									}
								}
								e.set(h.name, g)
							}
						}, this);
						e.set(f.StartDate.name, c[0]);
						e.set(f.EndDate.name, c[1]);
						e.set(f.IsAllDay.name, c[2]);
						b = e.dirty;
						e.endEdit();
						return b
					},
					onCancel : function() {
						this.cleanup(true);
						this.fireEvent("eventcancel", this, this.activeRecord)
					},
					cleanup : function(a) {
						if (this.activeRecord) {
							this.activeRecord.reject()
						}
						delete this.activeRecord;
						if (this.form.isDirty()) {
							this.form.reset()
						}
					},
					onSave : function() {
						if (!this.form.isValid()) {
							return
						}
						if (!this.updateRecord()) {
							this.onCancel();
							return
						}
						this.fireEvent(this.activeRecord.phantom ? "eventadd"
								: "eventupdate", this, this.activeRecord)
					},
					onDelete : function() {
						this.fireEvent("eventdelete", this, this.activeRecord)
					}
				});
Ext.reg("extensible.eventeditform", Ext.ensible.cal.EventEditForm);
Ext.ensible.cal.EventEditWindow = Ext
		.extend(
				Ext.Window,
				{
					titleTextAdd : "Add Event",
					titleTextEdit : "Edit Event",
					width : 600,
					border : true,
					closeAction : "hide",
					modal : false,
					resizable : false,
					buttonAlign : "left",
					labelWidth : 65,
					detailsLinkText : "Edit Details...",
					savingMessage : "Saving changes...",
					deletingMessage : "Deleting event...",
					saveButtonText : "Save",
					deleteButtonText : "Delete",
					cancelButtonText : "Cancel",
					titleLabelText : "Title",
					datesLabelText : "When",
					calendarLabelText : "Calendar",
					editDetailsLinkClass : "edit-dtl-link",
					bodyStyle : "padding:5px 10px;",
					enableEditDetails : true,
					initComponent : function() {
						this.addEvents({
							eventadd : true,
							eventupdate : true,
							eventdelete : true,
							eventcancel : true,
							editdetails : true
						});
						this.fbar = [ "->", {
							text : this.saveButtonText,
							disabled : false,
							handler : this.onSave,
							scope : this
						}, {
							id : this.id + "-delete-btn",
							text : this.deleteButtonText,
							disabled : false,
							handler : this.onDelete,
							scope : this,
							hideMode : "offsets"
						}, {
							text : this.cancelButtonText,
							disabled : false,
							handler : this.onCancel,
							scope : this
						} ];
						if (this.enableEditDetails !== false) {
							this.fbar.unshift({
								xtype : "tbtext",
								text : '<a href="#" class="'
										+ this.editDetailsLinkClass + '">'
										+ this.detailsLinkText + "</a>"
							})
						}
						Ext.ensible.cal.EventEditWindow.superclass.initComponent
								.call(this)
					},
					onRender : function(c, a) {
						this.deleteBtn = Ext.getCmp(this.id + "-delete-btn");
						this.titleField = new Ext.form.TextField({
							name : Ext.ensible.cal.EventMappings.Title.name,
							fieldLabel : this.titleLabelText,
							anchor : "100%"
						});
						this.dateRangeField = new Ext.ensible.cal.DateRangeField(
								{
									anchor : "95%",
									fieldLabel : this.datesLabelText
								});
						var b = [ this.titleField, this.dateRangeField ];
						if (this.calendarStore) {
							this.calendarField = new Ext.ensible.cal.CalendarCombo(
									{
										name : Ext.ensible.cal.EventMappings.CalendarId.name,
										anchor : "100%",
										fieldLabel : this.calendarLabelText,
										store : this.calendarStore
									});
							b.push(this.calendarField)
						}
						this.formPanel = new Ext.FormPanel({
							labelWidth : this.labelWidth,
							frame : false,
							bodyBorder : false,
							border : false,
							items : b
						});
						this.add(this.formPanel);
						Ext.ensible.cal.EventEditWindow.superclass.onRender
								.call(this, c, a)
					},
					afterRender : function() {
						Ext.ensible.cal.EventEditWindow.superclass.afterRender
								.call(this);
						this.el.addClass("ext-cal-event-win");
						this.el.select("." + this.editDetailsLinkClass).on(
								"click", this.onEditDetailsClick, this)
					},
					onEditDetailsClick : function(a) {
						a.stopEvent();
						this.updateRecord(true);
						this.fireEvent("editdetails", this, this.activeRecord,
								this.animateTarget)
					},
					show : function(h, g) {
						var c = (Ext.isIE8 && Ext.isStrict) ? null : g, k = Ext.ensible.cal.EventMappings;
						Ext.ensible.cal.EventEditWindow.superclass.show.call(
								this, c, function() {
									this.titleField.focus(false, 100)
								});
						this.deleteBtn[h.data && h.data[k.EventId.name] ? "show"
								: "hide"]();
						var e, b = this.formPanel.form;
						if (h.data) {
							e = h;
							if (e.phantom) {
								this.setTitle(this.titleTextAdd)
							} else {
								this.setTitle(this.titleTextEdit)
							}
							b.loadRecord(e)
						} else {
							this.setTitle(this.titleTextAdd);
							var i = h[k.StartDate.name], a = h[k.EndDate.name]
									|| i.add("h", 1);
							e = new Ext.ensible.cal.EventRecord();
							e.data[k.StartDate.name] = i;
							e.data[k.EndDate.name] = a;
							e.data[k.IsAllDay.name] = !!h[k.IsAllDay.name]
									|| i.getDate() != a.clone().add(Date.MILLI,
											1).getDate();
							b.reset();
							b.loadRecord(e)
						}
						if (this.calendarStore) {
							this.calendarField
									.setValue(e.data[k.CalendarId.name])
						}
						this.dateRangeField.setValue(e.data);
						this.activeRecord = e;
						this.el.setStyle("z-index", 12000);
						return this
					},
					roundTime : function(b, c) {
						c = c || 15;
						var a = parseInt(b.getMinutes());
						return b.add("mi", c - (a % c))
					},
					onCancel : function() {
						this.cleanup(true);
						this.fireEvent("eventcancel", this, this.animateTarget)
					},
					cleanup : function(a) {
						if (this.activeRecord) {
							this.activeRecord.reject()
						}
						delete this.activeRecord;
						if (a === true) {
							this.hide()
						}
					},
					updateRecord : function(e) {
						var f = this.dateRangeField.getValue(), h = Ext.ensible.cal.EventMappings, g = this.activeRecord, c = this.formPanel.form, a = g.fields, b = false;
						g.beginEdit();
						a.each(function(k) {
							var l = c.findField(k.name);
							if (l) {
								var i = l.getValue();
								if (i.getGroupValue) {
									i = i.getGroupValue()
								} else {
									if (l.eachItem) {
										i = [];
										l.eachItem(function(m) {
											i.push(m.getValue())
										})
									}
								}
								g.set(k.name, i)
							}
						}, this);
						g.set(h.StartDate.name, f[0]);
						g.set(h.EndDate.name, f[1]);
						g.set(h.IsAllDay.name, f[2]);
						b = g.dirty;
						if (!e) {
							g.endEdit()
						}
						return b
					},
					onSave : function() {
						if (!this.formPanel.form.isValid()) {
							return
						}
						if (!this.updateRecord()) {
							this.onCancel();
							return
						}
						this.fireEvent(this.activeRecord.phantom ? "eventadd"
								: "eventupdate", this, this.activeRecord,
								this.animateTarget)
					},
					onDelete : function() {
						this.fireEvent("eventdelete", this, this.activeRecord,
								this.animateTarget)
					}
				});
Ext.reg("extensible.eventeditwindow", Ext.ensible.cal.EventEditWindow);
Ext.ensible.cal.CalendarView = Ext
		.extend(
				Ext.BoxComponent,
				{
					startDay : 0,
					spansHavePriority : false,
					trackMouseOver : true,
					enableFx : true,
					enableAddFx : true,
					enableUpdateFx : false,
					enableRemoveFx : true,
					enableDD : true,
					enableContextMenus : true,
					suppressBrowserContextMenu : false,
					monitorResize : true,
					todayText : "Today",
					ddCreateEventText : "Create event for {0}",
					ddMoveEventText : "Move event to {0}",
					ddResizeEventText : "Update event to {0}",
					defaultEventTitleText : "(No title)",
					dateParamStart : "start",
					dateParamEnd : "end",
					dateParamFormat : "Y-m-d",
					editModal : false,
					enableEditDetails : true,
					weekendCls : "ext-cal-day-we",
					prevMonthCls : "ext-cal-day-prev",
					nextMonthCls : "ext-cal-day-next",
					todayCls : "ext-cal-day-today",
					hideMode : "offsets",
					weekCount : 1,
					dayCount : 1,
					eventSelector : ".ext-cal-evt",
					eventOverClass : "ext-evt-over",
					eventElIdDelimiter : "-evt-",
					dayElIdDelimiter : "-day-",
					getEventBodyMarkup : Ext.emptyFn,
					getEventTemplate : Ext.emptyFn,
					initComponent : function() {
						this.setStartDate(this.startDate || new Date());
						Ext.ensible.cal.CalendarView.superclass.initComponent
								.call(this);
						if (this.readOnly === true) {
							this.addClass("ext-cal-readonly")
						}
						this.addEvents({
							eventsrendered : true,
							eventclick : true,
							eventover : true,
							eventout : true,
							beforedatechange : true,
							datechange : true,
							rangeselect : true,
							beforeeventmove : true,
							eventmove : true,
							initdrag : true,
							dayover : true,
							dayout : true,
							editdetails : true,
							eventadd : true,
							eventupdate : true,
							eventcancel : true,
							beforeeventdelete : true,
							eventdelete : true
						})
					},
					afterRender : function() {
						Ext.ensible.cal.CalendarView.superclass.afterRender
								.call(this);
						this.renderTemplate();
						if (this.store) {
							this.setStore(this.store, true);
							if (this.store.deferLoad) {
								this.reloadStore(this.store.deferLoad);
								delete this.store.deferLoad
							} else {
								this.store.initialParams = this
										.getStoreParams()
							}
						}
						if (this.calendarStore) {
							this.setCalendarStore(this.calendarStore, true)
						}
						this.el.on({
							mouseover : this.onMouseOver,
							mouseout : this.onMouseOut,
							click : this.onClick,
							resize : this.onResize,
							scope : this
						});
						if (this.enableContextMenus && this.readOnly !== true) {
							this.el.on("contextmenu", this.onContextMenu, this)
						}
						this.el.unselectable();
						if (this.enableDD && this.readOnly !== true
								&& this.initDD) {
							this.initDD()
						}
						this.on("eventsrendered", this.onEventsRendered, this);
						this.forceSize.defer(100, this)
					},
					getStoreDateParams : function() {
						var a = {};
						a[this.dateParamStart] = this.viewStart
								.format(this.dateParamFormat);
						a[this.dateParamEnd] = this.viewEnd
								.format(this.dateParamFormat);
						return a
					},
					getStoreParams : function() {
						var a = this.getStoreDateParams();
						return a
					},
					reloadStore : function(a) {
						Ext.ensible.log("reloadStore");
						a = Ext.isObject(a) ? a : {};
						a.params = a.params || {};
						Ext.apply(a.params, this.getStoreParams());
						this.store.load(a)
					},
					onEventsRendered : function() {
						this.forceSize()
					},
					forceSize : function() {
						if (this.el && this.el.child) {
							var c = this.el.child(".ext-cal-hd-ct"), a = this.el
									.child(".ext-cal-body-ct"), b = this.el
									.parent();
							if (c && a) {
								a.setHeight(b.getHeight() - c.getHeight())
							}
						}
					},
					refresh : function(a) {
						Ext.ensible.log("refresh (base), reload = " + a);
						if (a === true) {
							this.reloadStore()
						}
						this.prepareData();
						this.renderTemplate();
						this.renderItems()
					},
					getWeekCount : function() {
						var a = Ext.ensible.Date.diffDays(this.viewStart,
								this.viewEnd);
						return Math.ceil(a / this.dayCount)
					},
					prepareData : function() {
						var h = this.startDate.getLastDateOfMonth(), c = 0, g = 0, f = this.viewStart
								.clone(), e = this.weekCount < 1 ? 6
								: this.weekCount;
						this.eventGrid = [ [] ];
						this.allDayGrid = [ [] ];
						this.evtMaxCount = [];
						var b = this.store.queryBy(function(i) {
							return this.isEventVisible(i.data)
						}, this);
						for (; c < e; c++) {
							this.evtMaxCount[c] = 0;
							if (this.weekCount == -1 && f > h) {
								break
							}
							this.eventGrid[c] = this.eventGrid[c] || [];
							this.allDayGrid[c] = this.allDayGrid[c] || [];
							for (d = 0; d < this.dayCount; d++) {
								if (b.getCount() > 0) {
									var a = b
											.filterBy(
													function(l) {
														var k = (f.getTime() == l.data[Ext.ensible.cal.EventMappings.StartDate.name]
																.clearTime(true)
																.getTime());
														var i = (c == 0
																&& d == 0 && (f > l.data[Ext.ensible.cal.EventMappings.StartDate.name]));
														return k || i
													}, this);
									this.sortEventRecordsForDay(a);
									this.prepareEventGrid(a, c, d)
								}
								f = f.add(Date.DAY, 1)
							}
						}
						this.currentWeekCount = c
					},
					prepareEventGrid : function(c, b, i) {
						var g = this, h = 0, f = g.viewStart.clone(), a = g.maxEventsPerDay || 999, e;
						c
								.each(
										function(l) {
											var m = Ext.ensible.cal.EventMappings;
											if (Ext.ensible.Date.diffDays(
													l.data[m.StartDate.name],
													l.data[m.EndDate.name]) > 0) {
												var k = Ext.ensible.Date
														.diffDays(
																Ext.ensible.Date
																		.max(
																				g.viewStart,
																				l.data[m.StartDate.name]),
																Ext.ensible.Date
																		.min(
																				g.viewEnd,
																				l.data[m.EndDate.name])) + 1;
												g.prepareEventGridSpans(l,
														g.eventGrid, b, i, k);
												g.prepareEventGridSpans(l,
														g.allDayGrid, b, i, k,
														true)
											} else {
												h = g.findEmptyRowIndex(b, i);
												g.eventGrid[b][i] = g.eventGrid[b][i]
														|| [];
												g.eventGrid[b][i][h] = l;
												if (l.data[m.IsAllDay.name]) {
													h = g.findEmptyRowIndex(b,
															i, true);
													g.allDayGrid[b][i] = g.allDayGrid[b][i]
															|| [];
													g.allDayGrid[b][i][h] = l
												}
											}
											e = g[g.isHeaderView ? "allDayGrid"
													: "eventGrid"][b][i]
													|| [];
											if (e.length
													&& g.evtMaxCount[b] < e.length) {
												g.evtMaxCount[b] = Math.min(
														a + 1, e.length)
											}
											return true
										}, g)
					},
					prepareEventGridSpans : function(i, a, h, g, k, l) {
						var f = h, b = g, m = this.findEmptyRowIndex(h, g, l), e = this.viewStart
								.clone();
						var c = {
							event : i,
							isSpan : true,
							isSpanStart : true,
							spanLeft : false,
							spanRight : (g == 6)
						};
						a[h][g] = a[h][g] || [];
						a[h][g][m] = c;
						while (--k) {
							e = e.add(Date.DAY, 1);
							if (e > this.viewEnd) {
								break
							}
							if (++b > 6) {
								b = 0;
								f++;
								m = this.findEmptyRowIndex(f, 0)
							}
							a[f] = a[f] || [];
							a[f][b] = a[f][b] || [];
							a[f][b][m] = {
								event : i,
								isSpan : true,
								isSpanStart : (b == 0),
								spanLeft : (f > h) && (b % 7 == 0),
								spanRight : (b == 6) && (k > 1)
							}
						}
					},
					findEmptyRowIndex : function(b, h, a) {
						var f = a ? this.allDayGrid : this.eventGrid, c = f[b] ? f[b][h]
								|| []
								: [], e = 0, g = c.length;
						for (; e < g; e++) {
							if (c[e] == null) {
								return e
							}
						}
						return g
					},
					renderTemplate : function() {
						if (this.tpl) {
							this.tpl.overwrite(this.el, this
									.getTemplateParams());
							this.lastRenderStart = this.viewStart.clone();
							this.lastRenderEnd = this.viewEnd.clone()
						}
					},
					getTemplateParams : function() {
						return {
							viewStart : this.viewStart,
							viewEnd : this.viewEnd,
							startDate : this.startDate,
							dayCount : this.dayCount,
							weekCount : this.weekCount,
							weekendCls : this.weekendCls,
							prevMonthCls : this.prevMonthCls,
							nextMonthCls : this.nextMonthCls,
							todayCls : this.todayCls
						}
					},
					disableStoreEvents : function() {
						this.monitorStoreEvents = false;
						return this
					},
					enableStoreEvents : function(a) {
						this.monitorStoreEvents = true;
						if (a === true) {
							this.refresh()
						}
						return this
					},
					onResize : function() {
						this.refresh(false)
					},
					onInitDrag : function() {
						this.fireEvent("initdrag", this)
					},
					onEventDrop : function(b, a) {
						this.moveEvent(b, a)
					},
					onCalendarEndDrag : function(e, a, c) {
						this.dragPending = true;
						var b = {}, c = this.onCalendarEndDragComplete
								.createDelegate(this, [ c ]);
						b[Ext.ensible.cal.EventMappings.StartDate.name] = e;
						b[Ext.ensible.cal.EventMappings.EndDate.name] = a;
						if (this.fireEvent("rangeselect", this, b, c) !== false) {
							this.showEventEditor(b, null);
							this.editWin.on("hide", c, this, {
								single : true
							})
						} else {
							this.onCalendarEndDragComplete(c)
						}
					},
					onCalendarEndDragComplete : function(a) {
						a();
						this.dragPending = false
					},
					onUpdate : function(b, c, a) {
						if (this.hidden === true
								|| this.monitorStoreEvents === false) {
							return
						}
						if (a == Ext.data.Record.COMMIT) {
							Ext.ensible.log("onUpdate");
							this.dismissEventEditor();
							var e = c.data[Ext.ensible.cal.EventMappings.RRule.name];
							this.refresh(e !== undefined && e !== "");
							if (this.enableFx && this.enableUpdateFx) {
								this
										.doUpdateFx(
												this
														.getEventEls(c.data[Ext.ensible.cal.EventMappings.EventId.name]),
												{
													scope : this
												})
							}
						}
					},
					doUpdateFx : function(a, b) {
						this.highlightEvent(a, null, b)
					},
					onAdd : function(c, b, a) {
						var e = Ext.isArray(b) ? b[0] : b;
						if (this.hidden === true
								|| this.monitorStoreEvents === false
								|| e.phantom) {
							return
						}
						if (e._deleting) {
							delete e._deleting;
							return
						}
						Ext.ensible.log("onAdd");
						var f = e.data[Ext.ensible.cal.EventMappings.RRule.name];
						this.dismissEventEditor();
						this.tempEventId = e.id;
						this.refresh(f !== undefined && f !== "");
						if (this.enableFx && this.enableAddFx) {
							this
									.doAddFx(
											this
													.getEventEls(e.data[Ext.ensible.cal.EventMappings.EventId.name]),
											{
												scope : this
											})
						}
					},
					doAddFx : function(a, b) {
						a.fadeIn(Ext.apply(b, {
							duration : 2
						}))
					},
					onRemove : function(b, c) {
						if (this.hidden === true
								|| this.monitorStoreEvents === false) {
							return
						}
						Ext.ensible.log("onRemove");
						this.dismissEventEditor();
						var e = c.data[Ext.ensible.cal.EventMappings.RRule.name], a = e !== undefined
								&& e !== "";
						if (this.enableFx && this.enableRemoveFx) {
							this
									.doRemoveFx(
											this
													.getEventEls(c.data[Ext.ensible.cal.EventMappings.EventId.name]),
											{
												remove : true,
												scope : this,
												callback : this.refresh
														.createDelegate(this,
																[ a ])
											})
						} else {
							this
									.getEventEls(
											c.data[Ext.ensible.cal.EventMappings.EventId.name])
									.remove();
							this.refresh(a)
						}
					},
					doRemoveFx : function(a, b) {
						if (a.getCount() == 0 && Ext.isFunction(b.callback)) {
							b.callback.call(b.scope || this)
						} else {
							a.fadeOut(b)
						}
					},
					highlightEvent : function(b, a, e) {
						if (this.enableFx) {
							var f;
							!(Ext.isIE || Ext.isOpera) ? b.highlight(a, e) : b
									.each(function(c) {
										c.highlight(a, Ext.applyIf({
											attr : "color"
										}, e));
										if (f = c.child(".ext-cal-evm")) {
											f.highlight(a, e)
										}
									}, this)
						}
					},
					getEventIdFromEl : function(c) {
						c = Ext.get(c);
						var e, f = "", a, b = c.dom.className.split(" ");
						Ext.each(b, function(g) {
							e = g.split(this.eventElIdDelimiter);
							if (e.length > 1) {
								f = e[1];
								return false
							}
						}, this);
						return f
					},
					getEventId : function(a) {
						if (a === undefined && this.tempEventId) {
							a = this.tempEventId
						}
						return a
					},
					getEventSelectorCls : function(b, a) {
						var c = a ? "." : "";
						return c + this.id + this.eventElIdDelimiter
								+ this.getEventId(b)
					},
					getEventEls : function(b) {
						var a = this.el.select(this.getEventSelectorCls(this
								.getEventId(b), true), false);
						return new Ext.CompositeElement(a)
					},
					isToday : function() {
						var a = new Date().clearTime().getTime();
						return this.viewStart.getTime() <= a
								&& this.viewEnd.getTime() >= a
					},
					onDataChanged : function(a) {
						Ext.ensible.log("onDataChanged");
						this.refresh(false)
					},
					isEventVisible : function(i) {
						var f = Ext.ensible.cal.EventMappings, e = i.data ? i.data
								: i, h = e[f.CalendarId.name], b = this.calendarStore ? this.calendarStore
								.getById(h)
								: null;
						if (b
								&& b.data[Ext.ensible.cal.CalendarMappings.IsHidden.name] === true) {
							return false
						}
						var a = this.viewStart.getTime(), c = this.viewEnd
								.getTime(), k = e[f.StartDate.name].getTime(), g = e[f.EndDate.name]
								.getTime();
						return Ext.ensible.Date.rangesOverlap(a, c, k, g)
					},
					isOverlapping : function(m, l) {
						var k = m.data ? m.data : m, i = l.data ? l.data : l, f = Ext.ensible.cal.EventMappings, c = k[f.StartDate.name]
								.getTime(), g = k[f.EndDate.name].add(
								Date.SECOND, -1).getTime(), b = i[f.StartDate.name]
								.getTime(), e = i[f.EndDate.name].add(
								Date.SECOND, -1).getTime(), h = Ext.ensible.Date
								.diff(k[f.StartDate.name], i[f.StartDate.name],
										"m");
						if (g < c) {
							g = c
						}
						if (e < b) {
							e = b
						}
						var o = Ext.ensible.Date.rangesOverlap(c, g, b, e), n = this.minEventDisplayMinutes || 0, a = n > 0
								&& (h > -n && h < n);
						return (o || a)
					},
					getDayEl : function(a) {
						return Ext.get(this.getDayId(a))
					},
					getDayId : function(a) {
						if (Ext.isDate(a)) {
							a = a.format("Ymd")
						}
						return this.id + this.dayElIdDelimiter + a
					},
					getStartDate : function() {
						return this.startDate
					},
					setStartDate : function(b, a) {
						Ext.ensible.log("setStartDate (base) "
								+ b.format("Y-m-d"));
						if (this
								.fireEvent("beforedatechange", this,
										this.startDate, b, this.viewStart,
										this.viewEnd) !== false) {
							this.startDate = b.clearTime();
							this.setViewBounds(b);
							if (this.rendered) {
								this.refresh(a)
							}
							this.fireEvent("datechange", this, this.startDate,
									this.viewStart, this.viewEnd)
						}
					},
					setViewBounds : function(a) {
						var e = a || this.startDate, c = e.getDay()
								- this.startDay;
						if (c < 0) {
							c += 7
						}
						switch (this.weekCount) {
						case 0:
						case 1:
							this.viewStart = this.dayCount < 7
									&& !this.startDayIsStatic ? e : e.add(
									Date.DAY, -c).clearTime(true);
							this.viewEnd = this.viewStart.add(Date.DAY,
									this.dayCount || 7).add(Date.SECOND, -1);
							return;
						case -1:
							e = e.getFirstDateOfMonth();
							c = e.getDay() - this.startDay;
							if (c < 0) {
								c += 7
							}
							this.viewStart = e.add(Date.DAY, -c)
									.clearTime(true);
							var b = e.add(Date.MONTH, 1).add(Date.SECOND, -1);
							c = this.startDay;
							if (c > b.getDay()) {
								c -= 7
							}
							this.viewEnd = b.add(Date.DAY, 6 - b.getDay() + c);
							return;
						default:
							this.viewStart = e.add(Date.DAY, -c)
									.clearTime(true);
							this.viewEnd = this.viewStart.add(Date.DAY,
									this.weekCount * 7).add(Date.SECOND, -1)
						}
					},
					getViewBounds : function() {
						return {
							start : this.viewStart,
							end : this.viewEnd
						}
					},
					sortEventRecordsForDay : function(a) {
						if (a.length < 2) {
							return
						}
						a
								.sort(
										"ASC",
										function(g, f) {
											var e = g.data, c = f.data, i = Ext.ensible.cal.EventMappings;
											if (e[i.IsAllDay.name]) {
												return -1
											} else {
												if (c[i.IsAllDay.name]) {
													return 1
												}
											}
											if (this.spansHavePriority) {
												var h = Ext.ensible.Date.diffDays;
												if (h(e[i.StartDate.name],
														e[i.EndDate.name]) > 0) {
													if (h(c[i.StartDate.name],
															c[i.EndDate.name]) > 0) {
														if (e[i.StartDate.name]
																.getTime() == c[i.StartDate.name]
																.getTime()) {
															return c[i.EndDate.name]
																	.getTime()
																	- e[i.EndDate.name]
																			.getTime()
														}
														return e[i.StartDate.name]
																.getTime()
																- c[i.StartDate.name]
																		.getTime()
													}
													return -1
												} else {
													if (h(c[i.StartDate.name],
															c[i.EndDate.name]) > 0) {
														return 1
													}
												}
												return e[i.StartDate.name]
														.getTime()
														- c[i.StartDate.name]
																.getTime()
											} else {
												return e[i.StartDate.name]
														.getTime()
														- c[i.StartDate.name]
																.getTime()
											}
										}.createDelegate(this))
					},
					moveTo : function(b, a) {
						if (Ext.isDate(b)) {
							this.setStartDate(b, a);
							return this.startDate
						}
						return b
					},
					moveNext : function(a) {
						return this.moveTo(this.viewEnd.add(Date.DAY, 1), a)
					},
					movePrev : function(a) {
						var b = Ext.ensible.Date.diffDays(this.viewStart,
								this.viewEnd) + 1;
						return this.moveDays(-b, a)
					},
					moveMonths : function(b, a) {
						return this
								.moveTo(this.startDate.add(Date.MONTH, b), a)
					},
					moveWeeks : function(b, a) {
						return this.moveTo(this.startDate.add(Date.DAY, b * 7),
								a)
					},
					moveDays : function(b, a) {
						return this.moveTo(this.startDate.add(Date.DAY, b), a)
					},
					moveToday : function(a) {
						return this.moveTo(new Date(), a)
					},
					setStore : function(a, b) {
						var c = this.store;
						if (!b && c) {
							c.un("datachanged", this.onDataChanged, this);
							c.un("clear", this.refresh, this);
							c.un("write", this.onWrite, this);
							c.un("exception", this.onException, this)
						}
						if (a) {
							a.on("datachanged", this.onDataChanged, this);
							a.on("clear", this.refresh, this);
							a.on("write", this.onWrite, this);
							a.on("exception", this.onException, this)
						}
						this.store = a
					},
					onException : function(c, e, f, g, b, a) {
						if (a.reject) {
							a.reject()
						}
					},
					setCalendarStore : function(a, b) {
						if (!b && this.calendarStore) {
							this.calendarStore.un("datachanged", this.refresh,
									this);
							this.calendarStore.un("add", this.refresh, this);
							this.calendarStore.un("remove", this.refresh, this);
							this.calendarStore.un("update", this.refresh, this)
						}
						if (a) {
							a.on("datachanged", this.refresh, this);
							a.on("add", this.refresh, this);
							a.on("remove", this.refresh, this);
							a.on("update", this.refresh, this)
						}
						this.calendarStore = a
					},
					getEventRecord : function(b) {
						var a = this.store.find(
								Ext.ensible.cal.EventMappings.EventId.name, b,
								0, false, true);
						return this.store.getAt(a)
					},
					getEventRecordFromEl : function(a) {
						return this.getEventRecord(this.getEventIdFromEl(a))
					},
					getEventEditor : function() {
						this.editWin = this.editWin
								|| Ext.WindowMgr.get("ext-cal-editwin");
						if (!this.editWin) {
							this.editWin = new Ext.ensible.cal.EventEditWindow(
									{
										id : "ext-cal-editwin",
										calendarStore : this.calendarStore,
										modal : this.editModal,
										enableEditDetails : this.enableEditDetails,
										listeners : {
											eventadd : {
												fn : function(b, c, a) {
													b.currentView.onEventAdd(
															null, c)
												},
												scope : this
											},
											eventupdate : {
												fn : function(b, c, a) {
													b.currentView
															.onEventUpdate(
																	null, c)
												},
												scope : this
											},
											eventdelete : {
												fn : function(b, c, a) {
													b.currentView
															.onEventDelete(
																	null, c)
												},
												scope : this
											},
											editdetails : {
												fn : function(c, e, b, a) {
													c.hide(b);
													c.currentView
															.fireEvent(
																	"editdetails",
																	c.currentView,
																	e, b)
												},
												scope : this
											},
											eventcancel : {
												fn : function(b, c, a) {
													this.dismissEventEditor(a);
													b.currentView
															.onEventCancel()
												},
												scope : this
											}
										}
									})
						}
						this.editWin.currentView = this;
						return this.editWin
					},
					showEventEditor : function(b, a) {
						this.getEventEditor().show(b, a, this);
						return this
					},
					dismissEventEditor : function(b, c) {
						if (this.newRecord && this.newRecord.phantom) {
							this.store.remove(this.newRecord)
						}
						delete this.newRecord;
						var a = Ext.WindowMgr.get("ext-cal-editwin");
						if (a) {
							a[b ? b : "hide"](c)
						}
						return this
					},
					save : function() {
						if (!this.store.autoSave) {
							this.store.save()
						}
					},
					onWrite : function(a, c, b, f, e) {
						switch (c) {
						case "create":
							this.onAdd(a, e);
							break;
						case "update":
							this.onUpdate(a, e, Ext.data.Record.COMMIT);
							break;
						case "destroy":
							this.onRemove(a, e);
							break
						}
					},
					onEventAdd : function(a, b) {
						this.newRecord = b;
						if (!b.store) {
							this.store.add(b);
							this.save()
						}
						this.fireEvent("eventadd", this, b)
					},
					onEventUpdate : function(a, b) {
						this.save();
						this.fireEvent("eventupdate", this, b)
					},
					onEventDelete : function(a, b) {
						if (b.store) {
							this.store.remove(b)
						}
						this.save();
						this.fireEvent("eventdelete", this, b)
					},
					onEventCancel : function(a, b) {
						this.fireEvent("eventcancel", this, b)
					},
					onDayClick : function(c, b, a) {
						if (this.readOnly === true) {
							return
						}
						if (this.fireEvent("dayclick", this, c, b, a) !== false) {
							var f = Ext.ensible.cal.EventMappings, e = {};
							e[f.StartDate.name] = c;
							e[f.IsAllDay.name] = b;
							this.showEventEditor(e, a)
						}
					},
					showEventMenu : function(a, b) {
						if (!this.eventMenu) {
							this.eventMenu = new Ext.ensible.cal.EventContextMenu(
									{
										listeners : {
											editdetails : this.onEditDetails
													.createDelegate(this),
											eventdelete : this.onDeleteEvent
													.createDelegate(this),
											eventmove : this.onMoveEvent
													.createDelegate(this)
										}
									})
						}
						this.eventMenu.showForEvent(this
								.getEventRecordFromEl(a), a, b);
						this.menuActive = true
					},
					onEditDetails : function(c, b, a) {
						this.fireEvent("editdetails", this, b, a);
						this.menuActive = false
					},
					onMoveEvent : function(c, b, a) {
						this.moveEvent(b, a);
						this.menuActive = false
					},
					moveEvent : function(c, a) {
						if (Ext.ensible.Date
								.compare(
										c.data[Ext.ensible.cal.EventMappings.StartDate.name],
										a) === 0) {
							return
						}
						if (this.fireEvent("beforeeventmove", this, c, a) !== false) {
							var b = a.getTime()
									- c.data[Ext.ensible.cal.EventMappings.StartDate.name]
											.getTime();
							c.beginEdit();
							c.set(Ext.ensible.cal.EventMappings.StartDate.name,
									a);
							c
									.set(
											Ext.ensible.cal.EventMappings.EndDate.name,
											c.data[Ext.ensible.cal.EventMappings.EndDate.name]
													.add(Date.MILLI, b));
							c.endEdit();
							this.save();
							this.fireEvent("eventmove", this, c)
						}
					},
					onDeleteEvent : function(c, b, a) {
						b._deleting = true;
						this.deleteEvent(b, a);
						this.menuActive = false
					},
					deleteEvent : function(b, a) {
						if (this.fireEvent("beforeeventdelete", this, b, a) !== false) {
							this.store.remove(b);
							this.save();
							this.fireEvent("eventdelete", this, b, a)
						}
					},
					onContextMenu : function(f, b) {
						var c, a = false;
						if (c = f.getTarget(this.eventSelector, 5, true)) {
							this.dismissEventEditor().showEventMenu(c,
									f.getXY());
							a = true
						}
						if (a || this.suppressBrowserContextMenu === true) {
							f.preventDefault()
						}
					},
					onClick : function(c, a) {
						if (this.readOnly === true) {
							return true
						}
						if (this.dropZone) {
							this.dropZone.clearShims()
						}
						if (this.menuActive === true) {
							this.menuActive = false;
							return true
						}
						var b = c.getTarget(this.eventSelector, 5);
						if (b) {
							var g = this.getEventIdFromEl(b), f = this
									.getEventRecord(g);
							if (this.fireEvent("eventclick", this, f, b) !== false) {
								this.showEventEditor(f, b)
							}
							return true
						}
					},
					onMouseOver : function(b, a) {
						if (this.trackMouseOver !== false
								&& (this.dragZone == undefined || !this.dragZone.dragging)) {
							if (!this.handleEventMouseEvent(b, a, "over")) {
								this.handleDayMouseEvent(b, a, "over")
							}
						}
					},
					onMouseOut : function(b, a) {
						if (this.trackMouseOver !== false
								&& (this.dragZone == undefined || !this.dragZone.dragging)) {
							if (!this.handleEventMouseEvent(b, a, "out")) {
								this.handleDayMouseEvent(b, a, "out")
							}
						}
					},
					handleEventMouseEvent : function(h, c, g) {
						var f;
						if (f = h.getTarget(this.eventSelector, 5, true)) {
							var a = Ext.get(h.getRelatedTarget());
							if (f == a || f.contains(a)) {
								return true
							}
							var i = this.getEventIdFromEl(f);
							if (this.eventOverClass != "") {
								var b = this.getEventEls(i);
								b[g == "over" ? "addClass" : "removeClass"]
										(this.eventOverClass)
							}
							this.fireEvent("event" + g, this, this
									.getEventRecord(i), f);
							return true
						}
						return false
					},
					getDateFromId : function(c, b) {
						var a = c.split(b);
						return a[a.length - 1]
					},
					handleDayMouseEvent : function(k, f, h) {
						if (f = k.getTarget("td", 3)) {
							if (f.id
									&& f.id.indexOf(this.dayElIdDelimiter) > -1) {
								var i = this.getDateFromId(f.id,
										this.dayElIdDelimiter), a = Ext.get(k
										.getRelatedTarget()), c, b;
								if (a) {
									c = a.is("td") ? a : a.up("td", 3);
									b = c && c.id ? this.getDateFromId(c.id,
											this.dayElIdDelimiter) : ""
								}
								if (!a || i != b) {
									var g = this.getDayEl(i);
									if (g && this.dayOverClass != "") {
										g[h == "over" ? "addClass"
												: "removeClass"]
												(this.dayOverClass)
									}
									this.fireEvent("day" + h, this, Date
											.parseDate(i, "Ymd"), g)
								}
							}
						}
					},
					renderItems : function() {
						throw "This method must be implemented by a subclass"
					},
					destroy : function() {
						Ext.ensible.cal.CalendarView.superclass.destroy
								.call(this);
						if (this.el) {
							this.el.un("contextmenu", this.onContextMenu, this)
						}
						Ext.destroy(this.editWin, this.eventMenu,
								this.dragZone, this.dropZone)
					}
				});
Ext.ensible.cal.MonthView = Ext
		.extend(
				Ext.ensible.cal.CalendarView,
				{
					moreText : "+{0} more...",
					detailsTitleDateFormat : "F j",
					showTime : true,
					showTodayText : true,
					showHeader : false,
					showWeekLinks : false,
					showWeekNumbers : false,
					weekLinkOverClass : "ext-week-link-over",
					daySelector : ".ext-cal-day",
					moreSelector : ".ext-cal-ev-more",
					weekLinkSelector : ".ext-cal-week-link",
					weekCount : -1,
					dayCount : 7,
					moreElIdDelimiter : "-more-",
					weekLinkIdDelimiter : "ext-cal-week-",
					initComponent : function() {
						Ext.ensible.cal.MonthView.superclass.initComponent
								.call(this);
						this.addEvents({
							dayclick : true,
							weekclick : true,
							dayover : true,
							dayout : true
						})
					},
					initDD : function() {
						var a = {
							view : this,
							createText : this.ddCreateEventText,
							moveText : this.ddMoveEventText,
							ddGroup : this.ddGroup || this.id + "-MonthViewDD"
						};
						this.dragZone = new Ext.ensible.cal.DragZone(this.el, a);
						this.dropZone = new Ext.ensible.cal.DropZone(this.el, a)
					},
					onDestroy : function() {
						Ext.destroy(this.ddSelector);
						Ext.destroy(this.dragZone);
						Ext.destroy(this.dropZone);
						Ext.ensible.cal.MonthView.superclass.onDestroy
								.call(this)
					},
					afterRender : function() {
						if (!this.tpl) {
							this.tpl = new Ext.ensible.cal.MonthViewTemplate({
								id : this.id,
								showTodayText : this.showTodayText,
								todayText : this.todayText,
								showTime : this.showTime,
								showHeader : this.showHeader,
								showWeekLinks : this.showWeekLinks,
								showWeekNumbers : this.showWeekNumbers
							})
						}
						this.tpl.compile();
						this.addClass("ext-cal-monthview ext-cal-ct");
						Ext.ensible.cal.MonthView.superclass.afterRender
								.call(this)
					},
					onResize : function() {
						if (this.monitorResize) {
							this.maxEventsPerDay = this.getMaxEventsPerDay();
							this.refresh()
						}
					},
					forceSize : function() {
						if (this.showWeekLinks && this.el && this.el.child) {
							var f = this.el.select(".ext-cal-hd-days-tbl"), e = this.el
									.select(".ext-cal-bg-tbl"), c = this.el
									.select(".ext-cal-evt-tbl"), b = this.el
									.child(".ext-cal-week-link").getWidth(), a = this.el
									.getWidth()
									- b;
							f.setWidth(a);
							e.setWidth(a);
							c.setWidth(a)
						}
						Ext.ensible.cal.MonthView.superclass.forceSize
								.call(this)
					},
					initClock : function() {
						if (Ext.fly(this.id + "-clock") !== null) {
							this.prevClockDay = new Date().getDay();
							if (this.clockTask) {
								Ext.TaskMgr.stop(this.clockTask)
							}
							this.clockTask = Ext.TaskMgr
									.start({
										run : function() {
											var b = Ext.fly(this.id + "-clock"), a = new Date();
											if (a.getDay() == this.prevClockDay) {
												if (b) {
													b
															.update(a
																	.format(Ext.ensible.Date.use24HourTime ? "G:i"
																			: "g:ia"))
												}
											} else {
												this.prevClockDay = a.getDay();
												this.moveTo(a)
											}
										},
										scope : this,
										interval : 1000
									})
						}
					},
					getMoreText : function(a) {
						return this.moreText
					},
					getEventBodyMarkup : function() {
						if (!this.eventBodyMarkup) {
							this.eventBodyMarkup = [
									"{Title}",
									'<tpl if="_isReminder">',
									'<i class="ext-cal-ic ext-cal-ic-rem">&#160;</i>',
									"</tpl>",
									'<tpl if="_isRecurring">',
									'<i class="ext-cal-ic ext-cal-ic-rcr">&#160;</i>',
									"</tpl>", '<tpl if="spanLeft">',
									'<i class="ext-cal-spl">&#160;</i>',
									"</tpl>", '<tpl if="spanRight">',
									'<i class="ext-cal-spr">&#160;</i>',
									"</tpl>" ].join("")
						}
						return this.eventBodyMarkup
					},
					getEventTemplate : function() {
						if (!this.eventTpl) {
							var b, a = this.getEventBodyMarkup();
							b = !(Ext.isIE || Ext.isOpera) ? new Ext.XTemplate(
									'<div class="{_extraCls} {spanCls} ext-cal-evt ext-cal-evr">',
									a, "</div>")
									: new Ext.XTemplate(
											'<tpl if="_renderAsAllDay">',
											'<div class="{_extraCls} {spanCls} ext-cal-evt ext-cal-evo">',
											'<div class="ext-cal-evm">',
											'<div class="ext-cal-evi">',
											"</tpl>",
											'<tpl if="!_renderAsAllDay">',
											'<div class="{_extraCls} ext-cal-evt ext-cal-evr">',
											"</tpl>", a,
											'<tpl if="_renderAsAllDay">',
											"</div>", "</div>", "</tpl>",
											"</div>");
							b.compile();
							this.eventTpl = b
						}
						return this.eventTpl
					},
					getTemplateEventData : function(k) {
						var h = Ext.ensible.cal.EventMappings, f = [ this
								.getEventSelectorCls(k[h.EventId.name]) ], g = {}, b = k[h.RRule.name] != "", a = "x-cal-default", i = k[h.Title.name], c = Ext.ensible.Date.use24HourTime ? "G:i "
								: "g:ia ";
						if (this.calendarStore && k[h.CalendarId.name]) {
							var e = this.calendarStore
									.getById(k[h.CalendarId.name]);
							if (e) {
								a = "x-cal-"
										+ e.data[Ext.ensible.cal.CalendarMappings.ColorId.name]
							}
						}
						a += (k._renderAsAllDay ? "-ad" : "");
						f.push(a);
						if (this.getEventClass) {
							var e = this.getEventRecord(k[h.EventId.name]), l = this
									.getEventClass(e, !!k._renderAsAllDay, g,
											this.store);
							f.push(l)
						}
						g._extraCls = f.join(" ");
						g._isRecurring = k.Recurrence && k.Recurrence != "";
						g._isReminder = k[h.Reminder.name]
								&& k[h.Reminder.name] != "";
						g.Title = (k[h.IsAllDay.name] ? ""
								: k[h.StartDate.name].format(c))
								+ (!i || i.length == 0 ? this.defaultEventTitleText
										: i);
						return Ext.applyIf(g, k)
					},
					refresh : function(a) {
						Ext.ensible.log("refresh (MonthView)");
						if (this.detailPanel) {
							this.detailPanel.hide()
						}
						Ext.ensible.cal.MonthView.superclass.refresh.call(this,
								a);
						if (this.showTime !== false) {
							this.initClock()
						}
					},
					renderItems : function() {
						Ext.ensible.cal.WeekEventRenderer.render({
							eventGrid : this.allDayOnly ? this.allDayGrid
									: this.eventGrid,
							viewStart : this.viewStart,
							tpl : this.getEventTemplate(),
							maxEventsPerDay : this.maxEventsPerDay,
							viewId : this.id,
							templateDataFn : this.getTemplateEventData
									.createDelegate(this),
							evtMaxCount : this.evtMaxCount,
							weekCount : this.weekCount,
							dayCount : this.dayCount,
							getMoreText : this.getMoreText.createDelegate(this)
						});
						this.fireEvent("eventsrendered", this)
					},
					getDayEl : function(a) {
						return Ext.get(this.getDayId(a))
					},
					getDayId : function(a) {
						if (Ext.isDate(a)) {
							a = a.format("Ymd")
						}
						return this.id + this.dayElIdDelimiter + a
					},
					getWeekIndex : function(b) {
						var a = this.getDayEl(b).up(".ext-cal-wk-ct");
						return parseInt(a.id.split("-wk-")[1])
					},
					getDaySize : function(g) {
						var c = this.el.getBox(), f = this.getViewPadding(), a = (c.width - f.width)
								/ this.dayCount, b = (c.height - f.height)
								/ this.getWeekCount();
						if (g) {
							var e = this.el.select(".ext-cal-dtitle").last()
									.parent("tr");
							b = e ? b - e.getHeight(true) : b
						}
						return {
							height : b,
							width : a
						}
					},
					getEventHeight : function() {
						if (!this.eventHeight) {
							var a = this.el.select(".ext-cal-evt").first();
							if (a) {
								this.eventHeight = a.parent("td").getHeight()
							} else {
								return 16
							}
						}
						return this.eventHeight
					},
					getMaxEventsPerDay : function() {
						var b = this.getDaySize(true).height, c = this
								.getEventHeight(), e = 5, a = Math.max(Math
								.floor((b - c - e) / c), 0);
						return a
					},
					getViewPadding : function(e) {
						var e = e || "tlbr", g = e.indexOf("t") > -1, f = e
								.indexOf("l") > -1, b = e.indexOf("r") > -1, a = this.showHeader
								&& g ? this.el.select(".ext-cal-hd-days-tbl")
								.first().getHeight() : 0, c = 0;
						if (this.isHeaderView) {
							if (f) {
								c = this.el.select(".ext-cal-gutter").first()
										.getWidth()
							}
							if (b) {
								c += this.el.select(".ext-cal-gutter-rt")
										.first().getWidth()
							}
						} else {
							if (this.showWeekLinks && f) {
								c = this.el.select(".ext-cal-week-link")
										.first().getWidth()
							}
						}
						return {
							height : a,
							width : c
						}
					},
					getDayAt : function(i, f) {
						var c = this.el.getBox(), g = this.getViewPadding("tl"), h = this
								.getDaySize(), e = Math
								.floor(((i - c.x - g.width) / h.width)), b = Math
								.floor(((f - c.y - g.height) / h.height)), k = (b * 7)
								+ e;
						var a = this.viewStart.add(Date.DAY, k);
						return {
							date : a,
							el : this.getDayEl(a)
						}
					},
					moveNext : function() {
						return this.moveMonths(1, true)
					},
					movePrev : function() {
						return this.moveMonths(-1, true)
					},
					onInitDrag : function() {
						Ext.ensible.cal.MonthView.superclass.onInitDrag
								.call(this);
						Ext.select(this.daySelector).removeClass(
								this.dayOverClass);
						if (this.detailPanel) {
							this.detailPanel.hide()
						}
					},
					onMoreClick : function(a) {
						if (!this.detailPanel) {
							this.detailPanel = new Ext.Panel(
									{
										id : this.id + "-details-panel",
										title : a
												.format(this.detailsTitleDateFormat),
										layout : "fit",
										floating : true,
										renderTo : Ext.getBody(),
										tools : [ {
											id : "close",
											handler : function(f, b, c) {
												c.hide()
											}
										} ],
										items : {
											xtype : "extensible.monthdaydetailview",
											id : this.id + "-details-view",
											date : a,
											view : this,
											store : this.store,
											calendarStore : this.calendarStore,
											listeners : {
												eventsrendered : this.onDetailViewUpdated
														.createDelegate(this)
											}
										}
									});
							if (this.enableContextMenus
									&& this.readOnly !== true) {
								this.detailPanel.body.on("contextmenu",
										this.onContextMenu, this)
							}
						} else {
							this.detailPanel.setTitle(a
									.format(this.detailsTitleDateFormat))
						}
						this.detailPanel
								.getComponent(this.id + "-details-view")
								.update(a)
					},
					onDetailViewUpdated : function(h, c, i) {
						var b = this.detailPanel, f = b.getFrameHeight(), k = this
								.getEventHeight(), a = f + (i * k) + 3, g = this
								.getDayEl(c), e = g.getBox();
						b.setHeight(a);
						b.setWidth(Math.max(e.width, 220));
						b.show();
						b.getPositionEl().alignTo(g, "t-t?")
					},
					onHide : function() {
						Ext.ensible.cal.MonthView.superclass.onHide.call(this);
						if (this.detailPanel) {
							this.detailPanel.hide()
						}
					},
					onClick : function(f, a) {
						if (this.detailPanel) {
							this.detailPanel.hide()
						}
						if (el = f.getTarget(this.moreSelector, 3)) {
							var b = el.id.split(this.moreElIdDelimiter)[1];
							this.onMoreClick(Date.parseDate(b, "Ymd"));
							return
						}
						if (el = f.getTarget(this.weekLinkSelector, 3)) {
							var b = el.id.split(this.weekLinkIdDelimiter)[1];
							this.fireEvent("weekclick", this, Date.parseDate(b,
									"Ymd"));
							return
						}
						if (Ext.ensible.cal.MonthView.superclass.onClick.apply(
								this, arguments)) {
							return
						}
						if (el = f.getTarget("td", 3)) {
							if (el.id
									&& el.id.indexOf(this.dayElIdDelimiter) > -1) {
								var c = el.id.split(this.dayElIdDelimiter), b = c[c.length - 1];
								this.onDayClick(Date.parseDate(b, "Ymd"),
										false, Ext.get(this.getDayId(b)));
								return
							}
						}
					},
					handleDayMouseEvent : function(f, a, c) {
						var b = f.getTarget(this.weekLinkSelector, 3, true);
						if (b) {
							b[c == "over" ? "addClass" : "removeClass"]
									(this.weekLinkOverClass);
							return
						}
						Ext.ensible.cal.MonthView.superclass.handleDayMouseEvent
								.apply(this, arguments)
					},
					destroy : function() {
						Ext.ensible.cal.MonthView.superclass.destroy.call(this);
						if (this.detailsPanel) {
							this.detailPanel.body.un("contextmenu",
									this.onContextMenu, this)
						}
					}
				});
Ext.reg("extensible.monthview", Ext.ensible.cal.MonthView);
Ext.ensible.cal.DayHeaderView = Ext
		.extend(
				Ext.ensible.cal.MonthView,
				{
					weekCount : 1,
					dayCount : 1,
					allDayOnly : true,
					monitorResize : false,
					isHeaderView : true,
					afterRender : function() {
						if (!this.tpl) {
							this.tpl = new Ext.ensible.cal.DayHeaderTemplate({
								id : this.id,
								showTodayText : this.showTodayText,
								todayText : this.todayText,
								showTime : this.showTime
							})
						}
						this.tpl.compile();
						this.addClass("ext-cal-day-header");
						Ext.ensible.cal.DayHeaderView.superclass.afterRender
								.call(this)
					},
					forceSize : Ext.emptyFn,
					refresh : function(a) {
						Ext.ensible.log("refresh (DayHeaderView)");
						Ext.ensible.cal.DayHeaderView.superclass.refresh.call(
								this, a);
						this.recalcHeaderBox()
					},
					recalcHeaderBox : function() {
						var b = this.el.child(".ext-cal-evt-tbl"), a = b
								.getHeight();
						this.el.setHeight(a + 7);
						this.el.child(".ext-cal-hd-ad-inner").setHeight(a + 5);
						this.el.child(".ext-cal-bg-tbl").setHeight(a + 5)
					},
					moveNext : function() {
						return this.moveDays(this.dayCount)
					},
					movePrev : function() {
						return this.moveDays(-this.dayCount)
					},
					onClick : function(f, a) {
						if (el = f.getTarget("td", 3)) {
							if (el.id
									&& el.id.indexOf(this.dayElIdDelimiter) > -1) {
								var c = el.id.split(this.dayElIdDelimiter), b = c[c.length - 1];
								this.onDayClick(Date.parseDate(b, "Ymd"), true,
										Ext.get(this.getDayId(b, true)));
								return
							}
						}
						Ext.ensible.cal.DayHeaderView.superclass.onClick.apply(
								this, arguments)
					}
				});
Ext.reg("extensible.dayheaderview", Ext.ensible.cal.DayHeaderView);
Ext.ensible.cal.DayBodyView = Ext
		.extend(
				Ext.ensible.cal.CalendarView,
				{
					dayColumnElIdDelimiter : "-day-col-",
					hourIncrement : 60,
					initComponent : function() {
						Ext.ensible.cal.DayBodyView.superclass.initComponent
								.call(this);
						if (this.readOnly === true) {
							this.enableEventResize = false
						}
						this.incrementsPerHour = this.hourIncrement
								/ this.ddIncrement;
						this.minEventHeight = this.minEventDisplayMinutes
								/ (this.hourIncrement / this.hourHeight);
						this.addEvents({
							beforeeventresize : true,
							eventresize : true,
							dayclick : true
						})
					},
					initDD : function() {
						var a = {
							view : this,
							createText : this.ddCreateEventText,
							moveText : this.ddMoveEventText,
							resizeText : this.ddResizeEventText,
							ddIncrement : this.ddIncrement,
							ddGroup : this.ddGroup || this.id + "-DayViewDD"
						};
						this.el.ddScrollConfig = {
							vthresh : Ext.isIE || Ext.isOpera ? 100 : 40,
							hthresh : -1,
							frequency : 50,
							increment : 100,
							ddGroup : this.ddGroup || this.id + "-DayViewDD"
						};
						this.dragZone = new Ext.ensible.cal.DayViewDragZone(
								this.el, Ext.apply({
									containerScroll : true
								}, a));
						this.dropZone = new Ext.ensible.cal.DayViewDropZone(
								this.el, a)
					},
					refresh : function(a) {
						Ext.ensible.log("refresh (DayBodyView)");
						var b = this.el.getScroll().top;
						Ext.ensible.cal.DayBodyView.superclass.refresh.call(
								this, a);
						if (this.scrollReady) {
							this.scrollTo(b)
						}
					},
					scrollTo : function(b, a) {
						a = a || (Ext.isIE || Ext.isOpera);
						if (a) {
							(function() {
								this.el.scrollTo("top", b);
								this.scrollReady = true
							}).defer(10, this)
						} else {
							this.el.scrollTo("top", b);
							this.scrollReady = true
						}
					},
					afterRender : function() {
						if (!this.tpl) {
							this.tpl = new Ext.ensible.cal.DayBodyTemplate({
								id : this.id,
								dayCount : this.dayCount,
								showTodayText : this.showTodayText,
								todayText : this.todayText,
								showTime : this.showTime,
								showHourSeparator : this.showHourSeparator,
								viewStartHour : this.viewStartHour,
								viewEndHour : this.viewEndHour,
								hourIncrement : this.hourIncrement,
								hourHeight : this.hourHeight
							})
						}
						this.tpl.compile();
						this.addClass("ext-cal-body-ct");
						Ext.ensible.cal.DayBodyView.superclass.afterRender
								.call(this);
						var b = Math.max(this.scrollStartHour,
								this.viewStartHour), a = Math.max(0, b
								- this.viewStartHour);
						if (a > 0) {
							this.scrollTo(a * this.hourHeight)
						}
					},
					forceSize : Ext.emptyFn,
					onEventResize : function(e, b) {
						if (this.fireEvent("beforeeventresize", this, e, b) !== false) {
							var c = Ext.ensible.Date, f = Ext.ensible.cal.EventMappings.StartDate.name, a = Ext.ensible.cal.EventMappings.EndDate.name;
							if (c.compare(e.data[f], b.StartDate) === 0
									&& c.compare(e.data[a], b.EndDate) === 0) {
								return
							}
							e.set(f, b.StartDate);
							e.set(a, b.EndDate);
							this.onEventUpdate(null, e);
							this.fireEvent("eventresize", this, e)
						}
					},
					getEventBodyMarkup : function() {
						if (!this.eventBodyMarkup) {
							this.eventBodyMarkup = [
									"{Title}",
									'<tpl if="_isReminder">',
									'<i class="ext-cal-ic ext-cal-ic-rem">&#160;</i>',
									"</tpl>",
									'<tpl if="_isRecurring">',
									'<i class="ext-cal-ic ext-cal-ic-rcr">&#160;</i>',
									"</tpl>" ].join("")
						}
						return this.eventBodyMarkup
					},
					getEventTemplate : function() {
						if (!this.eventTpl) {
							this.eventTpl = !(Ext.isIE || Ext.isOpera) ? new Ext.XTemplate(
									'<div id="{_elId}" class="{_extraCls} ext-cal-evt ext-cal-evr" style="left: {_left}%; width: {_width}%; top: {_top}px; height: {_height}px;">',
									'<div class="ext-evt-bd">',
									this.getEventBodyMarkup(),
									"</div>",
									this.enableEventResize ? '<div class="ext-evt-rsz"><div class="ext-evt-rsz-h">&#160;</div></div>'
											: "", "</div>")
									: new Ext.XTemplate(
											'<div id="{_elId}" class="ext-cal-evt {_extraCls}" style="left: {_left}%; width: {_width}%; top: {_top}px;">',
											'<div class="ext-cal-evb">&#160;</div>',
											'<dl style="height: {_height}px;" class="ext-cal-evdm">',
											'<dd class="ext-evt-bd">',
											this.getEventBodyMarkup(),
											"</dd>",
											this.enableEventResize ? '<div class="ext-evt-rsz"><div class="ext-evt-rsz-h">&#160;</div></div>'
													: "",
											"</dl>",
											'<div class="ext-cal-evb">&#160;</div>',
											"</div>");
							this.eventTpl.compile()
						}
						return this.eventTpl
					},
					getEventAllDayTemplate : function() {
						if (!this.eventAllDayTpl) {
							var b, a = this.getEventBodyMarkup();
							b = !(Ext.isIE || Ext.isOpera) ? new Ext.XTemplate(
									'<div class="{_extraCls} {spanCls} ext-cal-evt ext-cal-evr" style="left: {_left}%; width: {_width}%; top: {_top}px; height: {_height}px;">',
									a, "</div>")
									: new Ext.XTemplate(
											'<div class="ext-cal-evt" style="left: {_left}%; width: {_width}%; top: {_top}px; height: {_height}px;">',
											'<div class="{_extraCls} {spanCls} ext-cal-evo">',
											'<div class="ext-cal-evm">',
											'<div class="ext-cal-evi">', a,
											"</div>", "</div>", "</div></div>");
							b.compile();
							this.eventAllDayTpl = b
						}
						return this.eventAllDayTpl
					},
					getTemplateEventData : function(k) {
						var h = Ext.ensible.cal.EventMappings, f = [ this
								.getEventSelectorCls(k[h.EventId.name]) ], g = {}, a = "x-cal-default", i = k[h.Title.name], c = Ext.ensible.Date.use24HourTime ? "G:i "
								: "g:ia ", b = k[h.RRule.name] != "";
						this.getTemplateEventBox(k);
						if (this.calendarStore && k[h.CalendarId.name]) {
							var e = this.calendarStore
									.getById(k[h.CalendarId.name]);
							if (e) {
								a = "x-cal-"
										+ e.data[Ext.ensible.cal.CalendarMappings.ColorId.name]
							}
						}
						a += (k._renderAsAllDay ? "-ad" : "")
								+ (Ext.isIE || Ext.isOpera ? "-x" : "");
						f.push(a);
						if (this.getEventClass) {
							var e = this.getEventRecord(k[h.EventId.name]), l = this
									.getEventClass(e, !!k._renderAsAllDay, g,
											this.store);
							f.push(l)
						}
						g._extraCls = f.join(" ");
						g._isRecurring = k.Recurrence && k.Recurrence != "";
						g._isReminder = k[h.Reminder.name]
								&& k[h.Reminder.name] != "";
						g.Title = (k[h.IsAllDay.name] ? ""
								: k[h.StartDate.name].format(c))
								+ (!i || i.length == 0 ? this.defaultEventTitleText
										: i);
						return Ext.applyIf(g, k)
					},
					getEventPositionOffsets : function() {
						return {
							top : 1,
							height : -2
						}
					},
					getTemplateEventBox : function(k) {
						var c = this.hourHeight / this.hourIncrement, b = k[Ext.ensible.cal.EventMappings.StartDate.name], e = k[Ext.ensible.cal.EventMappings.EndDate.name], h = Math
								.max(b.getHours() - this.viewStartHour, 0), i = Math
								.min(e.getHours() - this.viewStartHour,
										this.viewEndHour - this.viewStartHour), a = h
								* this.hourIncrement, f = i
								* this.hourIncrement, l = e.clearTime(true)
								.add(Date.HOUR, this.viewEndHour), g = this
								.getEventPositionOffsets();
						if (b.getHours() >= this.viewStartHour) {
							a += b.getMinutes()
						}
						if (e <= l) {
							f += e.getMinutes()
						}
						k._left = 0;
						k._width = 100;
						k._top = a * c + g.top;
						k._height = Math
								.max(((f - a) * c), this.minEventHeight)
								+ g.height
					},
					renderItems : function() {
						var o = 0, c = [];
						for (; o < this.dayCount; o++) {
							var t = emptyCells = skipped = 0, u = this.eventGrid[0][o], b = u ? u.length
									: 0, g;
							for (; t < b; t++) {
								g = u[t];
								if (!g) {
									continue
								}
								var s = g.data || g.event.data, e = Ext.ensible.cal.EventMappings, v = s[e.IsAllDay.name] === true, n = Ext.ensible.Date
										.diffDays(s[e.StartDate.name],
												s[e.EndDate.name]) > 0, f = v
										|| n;
								if (f) {
									continue
								}
								Ext.apply(s, {
									cls : "ext-cal-ev",
									_positioned : true
								});
								c.push({
									data : this.getTemplateEventData(s),
									date : this.viewStart.add(Date.DAY, o)
								})
							}
						}
						var p = j = 0, q = [], k = c.length, a;
						for (; p < k; p++) {
							var g = c[p].data, m = null, h = g[Ext.ensible.cal.EventMappings.StartDate.name]
									.getDate();
							for (j = 0; j < k; j++) {
								if (p == j) {
									continue
								}
								m = c[j].data;
								if (this.isOverlapping(g, m)) {
									g._overlap = g._overlap == undefined ? 1
											: g._overlap + 1;
									if (p < j) {
										if (g._overcol === undefined) {
											g._overcol = 0
										}
										m._overcol = g._overcol + 1;
										q[h] = q[h] ? Math
												.max(q[h], m._overcol)
												: m._overcol
									}
								}
							}
						}
						for (p = 0; p < k; p++) {
							var g = c[p].data, h = g[Ext.ensible.cal.EventMappings.StartDate.name]
									.getDate();
							if (g._overlap !== undefined) {
								var w = 100 / (q[h] + 1), y = 100 - (w * g._overlap);
								g._width = w;
								g._left = w * g._overcol
							}
							var r = this.getEventTemplate().apply(g), x = this.id
									+ "-day-col-" + c[p].date.format("Ymd");
							Ext.DomHelper.append(x, r)
						}
						this.fireEvent("eventsrendered", this)
					},
					getDayEl : function(a) {
						return Ext.get(this.getDayId(a))
					},
					getDayId : function(a) {
						if (Ext.isDate(a)) {
							a = a.format("Ymd")
						}
						return this.id + this.dayColumnElIdDelimiter + a
					},
					getDaySize : function() {
						var a = this.el.child(".ext-cal-day-col-inner")
								.getBox();
						return {
							height : a.height,
							width : a.width
						}
					},
					getDayAt : function(o, k) {
						var f = ".ext-cal-body-ct", h = this.el.child(
								".ext-cal-day-times").getWidth(), s = this.el
								.getBox(), n = this.getDaySize(false), p = o
								- s.x - h, a = Math.floor(p / n.width), m = this.el
								.getScroll(), r = this.el
								.child(".ext-cal-bg-row"), q = r.getHeight()
								/ this.incrementsPerHour, l = k - s.y - q
								+ m.top, i = Math.max(0, Math.ceil(l / q)), b = i
								* (this.hourIncrement / this.incrementsPerHour), e = this.viewStart
								.add(Date.DAY, a).add(Date.MINUTE, b).add(
										Date.HOUR, this.viewStartHour), c = this
								.getDayEl(e), g = o;
						if (c) {
							g = c.getLeft()
						}
						return {
							date : e,
							el : c,
							timeBox : {
								x : g,
								y : (i * this.hourHeight / this.incrementsPerHour)
										+ s.y - m.top,
								width : n.width,
								height : q
							}
						}
					},
					onClick : function(g, b) {
						if (this.dragPending
								|| Ext.ensible.cal.DayBodyView.superclass.onClick
										.apply(this, arguments)) {
							return
						}
						if (g.getTarget(".ext-cal-day-times", 3) !== null) {
							return
						}
						var c = g.getTarget("td", 3);
						if (c) {
							if (c.id
									&& c.id.indexOf(this.dayElIdDelimiter) > -1) {
								var f = this.getDateFromId(c.id,
										this.dayElIdDelimiter);
								this.onDayClick(Date.parseDate(f, "Ymd"), true,
										Ext.get(this.getDayId(f)));
								return
							}
						}
						var a = this.getDayAt(g.xy[0], g.xy[1]);
						if (a && a.date) {
							this.onDayClick(a.date, false, null)
						}
					}
				});
Ext.reg("extensible.daybodyview", Ext.ensible.cal.DayBodyView);
Ext.ensible.cal.DayView = Ext
		.extend(
				Ext.Container,
				{
					ddCreateEventText : Ext.ensible.cal.CalendarView.prototype.ddCreateEventText,
					ddMoveEventText : Ext.ensible.cal.CalendarView.prototype.ddMoveEventText,
					showTime : true,
					showTodayText : true,
					dayCount : 1,
					enableEventResize : true,
					ddIncrement : 30,
					minEventDisplayMinutes : 30,
					showHourSeparator : true,
					viewStartHour : 0,
					viewEndHour : 24,
					scrollStartHour : 7,
					hourHeight : 42,
					hideMode : "offsets",
					initComponent : function() {
						this.dayCount = this.dayCount > 7 ? 7
								: (this.dayCount < 1 ? 1 : this.dayCount);
						var b = Ext.apply({}, this.initialConfig);
						b.showTime = this.showTime;
						b.showTodayText = this.showTodayText;
						b.todayText = this.todayText;
						b.dayCount = this.dayCount;
						b.weekCount = 1;
						b.readOnly = this.readOnly;
						b.ddIncrement = this.ddIncrement;
						b.minEventDisplayMinutes = this.minEventDisplayMinutes;
						var c = Ext.applyIf({
							xtype : "extensible.dayheaderview",
							id : this.id + "-hd",
							ownerCalendarPanel : this.ownerCalendarPanel
						}, b);
						var a = Ext.applyIf({
							xtype : "extensible.daybodyview",
							enableEventResize : this.enableEventResize,
							showHourSeparator : this.showHourSeparator,
							viewStartHour : this.viewStartHour,
							viewEndHour : this.viewEndHour,
							scrollStartHour : this.scrollStartHour,
							hourHeight : this.hourHeight,
							id : this.id + "-bd",
							ownerCalendarPanel : this.ownerCalendarPanel
						}, b);
						this.items = [ c, a ];
						this.addClass("ext-cal-dayview ext-cal-ct");
						Ext.ensible.cal.DayView.superclass.initComponent
								.call(this)
					},
					afterRender : function() {
						Ext.ensible.cal.DayView.superclass.afterRender
								.call(this);
						this.header = Ext.getCmp(this.id + "-hd");
						this.body = Ext.getCmp(this.id + "-bd");
						this.body.on("eventsrendered", this.forceSize, this)
					},
					refresh : function() {
						Ext.ensible.log("refresh (DayView)");
						this.header.refresh();
						this.body.refresh()
					},
					forceSize : function() {
						(function() {
							var a = this.el.up(".x-panel-body"), c = this.el
									.child(".ext-cal-day-header"), b;
							if (a && c) {
								b = a.getHeight() - c.getHeight();
								this.el.child(".ext-cal-body-ct").setHeight(
										b - 1)
							}
						}).defer(10, this)
					},
					onResize : function() {
						this.forceSize();
						this.refresh.defer(1, this)
					},
					doHide : function() {
						this.header.doHide.apply(this, arguments);
						this.body.doHide.apply(this, arguments)
					},
					getViewBounds : function() {
						return this.header.getViewBounds()
					},
					getStartDate : function() {
						return this.header.getStartDate()
					},
					setStartDate : function(a) {
						this.header.setStartDate(a, true);
						this.body.setStartDate(a)
					},
					renderItems : function() {
						this.header.renderItems();
						this.body.renderItems()
					},
					isToday : function() {
						return this.header.isToday()
					},
					moveTo : function(a) {
						this.header.moveTo(a);
						return this.body.moveTo(a, true)
					},
					moveNext : function() {
						this.header.moveNext();
						return this.body.moveNext(true)
					},
					movePrev : function(a) {
						this.header.movePrev();
						return this.body.movePrev(true)
					},
					moveDays : function(a) {
						this.header.moveDays(a);
						return this.body.moveDays(a, true)
					},
					moveToday : function() {
						this.header.moveToday();
						return this.body.moveToday(true)
					},
					showEventEditor : function(b, a) {
						return Ext.ensible.cal.CalendarView.prototype.showEventEditor
								.apply(this, arguments)
					},
					dismissEventEditor : function(a) {
						return Ext.ensible.cal.CalendarView.prototype.dismissEventEditor
								.apply(this, arguments)
					}
				});
Ext.reg("extensible.dayview", Ext.ensible.cal.DayView);
Ext.ensible.cal.MultiDayView = Ext.extend(Ext.ensible.cal.DayView, {
	dayCount : 3,
	startDayIsStatic : false,
	moveNext : function(a) {
		return this.moveDays(this.startDayIsStatic ? 7 : this.dayCount, a)
	},
	movePrev : function(a) {
		return this.moveDays(this.startDayIsStatic ? -7 : -this.dayCount, a)
	}
});
Ext.reg("extensible.multidayview", Ext.ensible.cal.MultiDayView);
Ext.ensible.cal.WeekView = Ext.extend(Ext.ensible.cal.MultiDayView, {
	dayCount : 7
});
Ext.reg("extensible.weekview", Ext.ensible.cal.WeekView);
Ext.ensible.cal.MultiWeekView = Ext.extend(Ext.ensible.cal.MonthView, {
	weekCount : 2,
	moveNext : function() {
		return this.moveWeeks(this.weekCount, true)
	},
	movePrev : function() {
		return this.moveWeeks(-this.weekCount, true)
	}
});
Ext.reg("extensible.multiweekview", Ext.ensible.cal.MultiWeekView);
Ext.ensible.cal.MonthDayDetailView = Ext
		.extend(
				Ext.BoxComponent,
				{
					initComponent : function() {
						Ext.ensible.cal.CalendarView.superclass.initComponent
								.call(this);
						this.addEvents({
							eventsrendered : true
						});
						if (!this.el) {
							this.el = document.createElement("div")
						}
					},
					afterRender : function() {
						this.tpl = this.getTemplate();
						Ext.ensible.cal.MonthDayDetailView.superclass.afterRender
								.call(this);
						this.el.on({
							click : this.view.onClick,
							mouseover : this.view.onMouseOver,
							mouseout : this.view.onMouseOut,
							scope : this.view
						})
					},
					getTemplate : function() {
						if (!this.tpl) {
							this.tpl = new Ext.XTemplate(
									'<div class="ext-cal-mdv x-unselectable">',
									'<table class="ext-cal-mvd-tbl" cellpadding="0" cellspacing="0">',
									"<tbody>",
									'<tpl for=".">',
									'<tr><td class="ext-cal-ev">{markup}</td></tr>',
									"</tpl>", "</tbody>", "</table>", "</div>")
						}
						this.tpl.compile();
						return this.tpl
					},
					update : function(a) {
						this.date = a;
						this.refresh()
					},
					refresh : function() {
						if (!this.rendered) {
							return
						}
						var a = this.view.getEventTemplate(), b = [];
						evts = this.store
								.queryBy(
										function(e) {
											var g = this.date.clearTime(true)
													.getTime(), k = Ext.ensible.cal.EventMappings, i = e.data[k.StartDate.name]
													.clearTime(true).getTime(), f = (g == i), h = false, m = e.data[k.CalendarId.name], c = this.calendarStore ? this.calendarStore
													.getById(m)
													: null;
											if (c
													&& c.data[Ext.ensible.cal.CalendarMappings.IsHidden.name] === true) {
												return false
											}
											if (!f) {
												var l = e.data[Ext.ensible.cal.EventMappings.EndDate.name]
														.clearTime(true)
														.getTime();
												h = i < g && l >= g
											}
											return f || h
										}, this);
						Ext.ensible.cal.CalendarView.prototype.sortEventRecordsForDay
								.call(this, evts);
						evts
								.each(
										function(c) {
											var e = c.data, f = Ext.ensible.cal.EventMappings;
											e._renderAsAllDay = e[f.IsAllDay.name]
													|| Ext.ensible.Date
															.diffDays(
																	e[f.StartDate.name],
																	e[f.EndDate.name]) > 0;
											e.spanLeft = Ext.ensible.Date
													.diffDays(
															e[f.StartDate.name],
															this.date) > 0;
											e.spanRight = Ext.ensible.Date
													.diffDays(this.date,
															e[f.EndDate.name]) > 0;
											e.spanCls = (e.spanLeft ? (e.spanRight ? "ext-cal-ev-spanboth"
													: "ext-cal-ev-spanleft")
													: (e.spanRight ? "ext-cal-ev-spanright"
															: ""));
											b
													.push({
														markup : a
																.apply(this
																		.getTemplateEventData(e))
													})
										}, this);
						this.tpl.overwrite(this.el, b);
						this.fireEvent("eventsrendered", this, this.date, evts
								.getCount())
					},
					getTemplateEventData : function(a) {
						var b = this.view.getTemplateEventData(a);
						b._elId = "dtl-" + b._elId;
						return b
					}
				});
Ext.reg("extensible.monthdaydetailview", Ext.ensible.cal.MonthDayDetailView);
Ext.ensible.cal.CalendarPanel = Ext
		.extend(
				Ext.Panel,
				{
					enableRecurrence : false,
					showDayView : true,
					showMultiDayView : false,
					showWeekView : true,
					showMultiWeekView : true,
					showMonthView : true,
					showNavBar : true,
					todayText : "Today",
					showTodayText : true,
					showTime : true,
					readOnly : false,
					showNavToday : true,
					showNavJump : true,
					showNavNextPrev : true,
					jumpToText : "Jump to:",
					goText : "Go",
					dayText : "Day",
					multiDayText : "{0} Days",
					weekText : "Week",
					multiWeekText : "{0} Weeks",
					monthText : "Month",
					editModal : false,
					enableEditDetails : true,
					layoutConfig : {
						layoutOnCardChange : true,
						deferredRender : true
					},
					startDate : new Date(),
					initComponent : function() {
						this.tbar = {
							cls : "ext-cal-toolbar",
							border : true,
							items : []
						};
						this.viewCount = 0;
						var b = (this.multiDayViewCfg && this.multiDayViewCfg.dayCount) || 3, g = (this.multiWeekViewCfg && this.multiWeekViewCfg.weekCount) || 2;
						if (this.showNavToday) {
							this.tbar.items.push({
								id : this.id + "-tb-today",
								text : this.todayText,
								handler : this.onTodayClick,
								scope : this
							})
						}
						if (this.showNavNextPrev) {
							this.tbar.items.push([ {
								id : this.id + "-tb-prev",
								handler : this.onPrevClick,
								scope : this,
								iconCls : "x-tbar-page-prev"
							}, {
								id : this.id + "-tb-next",
								handler : this.onNextClick,
								scope : this,
								iconCls : "x-tbar-page-next"
							} ])
						}
						if (this.showNavJump) {
							this.tbar.items.push([ this.jumpToText, {
								id : this.id + "-tb-jump-dt",
								xtype : "datefield",
								showToday : false
							}, {
								id : this.id + "-tb-jump",
								text : this.goText,
								handler : this.onJumpClick,
								scope : this
							} ])
						}
						this.tbar.items.push("->");
						if (this.showDayView) {
							this.tbar.items.push({
								id : this.id + "-tb-day",
								text : this.dayText,
								handler : this.onDayNavClick,
								scope : this,
								toggleGroup : this.id + "-tb-views"
							});
							this.viewCount++
						}
						if (this.showMultiDayView) {
							var i = String.format(this.getMultiDayText(b), b);
							this.tbar.items.push({
								id : this.id + "-tb-multiday",
								text : i,
								handler : this.onMultiDayNavClick,
								scope : this,
								toggleGroup : this.id + "-tb-views"
							});
							this.viewCount++
						}
						if (this.showWeekView) {
							this.tbar.items.push({
								id : this.id + "-tb-week",
								text : this.weekText,
								handler : this.onWeekNavClick,
								scope : this,
								toggleGroup : this.id + "-tb-views"
							});
							this.viewCount++
						}
						if (this.showMultiWeekView) {
							var i = String.format(this.getMultiWeekText(g), g);
							this.tbar.items.push({
								id : this.id + "-tb-multiweek",
								text : i,
								handler : this.onMultiWeekNavClick,
								scope : this,
								toggleGroup : this.id + "-tb-views"
							});
							this.viewCount++
						}
						if (this.showMonthView || this.viewCount == 0) {
							this.tbar.items.push({
								id : this.id + "-tb-month",
								text : this.monthText,
								handler : this.onMonthNavClick,
								scope : this,
								toggleGroup : this.id + "-tb-views"
							});
							this.viewCount++;
							this.showMonthView = true
						}
						var h = this.viewCount - 1;
						this.activeItem = this.activeItem === undefined ? h
								: (this.activeItem > h ? h : this.activeItem);
						if (this.showNavBar === false) {
							delete this.tbar;
							this.addClass("x-calendar-nonav")
						}
						Ext.ensible.cal.CalendarPanel.superclass.initComponent
								.call(this);
						this.addEvents({
							eventadd : true,
							eventupdate : true,
							beforeeventdelete : true,
							eventdelete : true,
							eventcancel : true,
							viewchange : true,
							editdetails : true
						});
						this.layout = "card";
						this.addClass("x-cal-panel");
						if (this.eventStore) {
							this.store = this.eventStore;
							delete this.eventStore
						}
						this.setStore(this.store);
						var k = {
							showToday : this.showToday,
							todayText : this.todayText,
							showTodayText : this.showTodayText,
							showTime : this.showTime,
							readOnly : this.readOnly,
							enableRecurrence : this.enableRecurrence,
							store : this.store,
							calendarStore : this.calendarStore,
							editModal : this.editModal,
							enableEditDetails : this.enableEditDetails,
							ownerCalendarPanel : this
						};
						if (this.showDayView) {
							var f = Ext.apply({
								xtype : "extensible.dayview",
								title : this.dayText
							}, k);
							f = Ext.apply(Ext.apply(f, this.viewConfig),
									this.dayViewCfg);
							f.id = this.id + "-day";
							this.initEventRelay(f);
							this.add(f)
						}
						if (this.showMultiDayView) {
							var a = Ext.apply({
								xtype : "extensible.multidayview",
								title : this.getMultiDayText(b)
							}, k);
							a = Ext.apply(Ext.apply(a, this.viewConfig),
									this.multiDayViewCfg);
							a.id = this.id + "-multiday";
							this.initEventRelay(a);
							this.add(a)
						}
						if (this.showWeekView) {
							var l = Ext.applyIf({
								xtype : "extensible.weekview",
								title : this.weekText
							}, k);
							l = Ext.apply(Ext.apply(l, this.viewConfig),
									this.weekViewCfg);
							l.id = this.id + "-week";
							this.initEventRelay(l);
							this.add(l)
						}
						if (this.showMultiWeekView) {
							var e = Ext.applyIf({
								xtype : "extensible.multiweekview",
								title : this.getMultiWeekText(g)
							}, k);
							e = Ext.apply(Ext.apply(e, this.viewConfig),
									this.multiWeekViewCfg);
							e.id = this.id + "-multiweek";
							this.initEventRelay(e);
							this.add(e)
						}
						if (this.showMonthView) {
							var c = Ext.applyIf({
								xtype : "extensible.monthview",
								title : this.monthText,
								listeners : {
									weekclick : {
										fn : function(n, m) {
											this.showWeek(m)
										},
										scope : this
									}
								}
							}, k);
							c = Ext.apply(Ext.apply(c, this.viewConfig),
									this.monthViewCfg);
							c.id = this.id + "-month";
							this.initEventRelay(c);
							this.add(c)
						}
						this.add(Ext.applyIf({
							xtype : "extensible.eventeditform",
							id : this.id + "-edit",
							calendarStore : this.calendarStore,
							enableRecurrence : this.enableRecurrence,
							listeners : {
								eventadd : {
									scope : this,
									fn : this.onEventAdd
								},
								eventupdate : {
									scope : this,
									fn : this.onEventUpdate
								},
								eventdelete : {
									scope : this,
									fn : this.onEventDelete
								},
								eventcancel : {
									scope : this,
									fn : this.onEventCancel
								}
							}
						}, this.editViewCfg))
					},
					initEventRelay : function(a) {
						a.listeners = a.listeners || {};
						a.listeners.afterrender = {
							fn : function(b) {
								this.relayEvents(b, [ "eventsrendered",
										"eventclick", "dayclick", "eventover",
										"eventout", "beforedatechange",
										"datechange", "rangeselect",
										"beforeeventmove", "eventmove",
										"initdrag", "dayover", "dayout",
										"beforeeventresize", "eventresize",
										"eventadd", "eventupdate",
										"beforeeventdelete", "eventdelete",
										"eventcancel" ]);
								b.on("editdetails", this.onEditDetails, this)
							},
							scope : this,
							single : true
						}
					},
					afterRender : function() {
						Ext.ensible.cal.CalendarPanel.superclass.afterRender
								.call(this);
						this.body.addClass("x-cal-body");
						(function() {
							this.updateNavState();
							this.setActiveView()
						}).defer(1, this)
					},
					onLayout : function() {
						Ext.ensible.cal.CalendarPanel.superclass.onLayout
								.call(this);
						if (!this.navInitComplete) {
							this.updateNavState();
							this.navInitComplete = true
						}
					},
					getMultiDayText : function(a) {
						return this.multiDayText
					},
					getMultiWeekText : function(a) {
						return this.multiWeekText
					},
					setStore : function(a, b) {
						var c = this.store;
						if (!b && c) {
							c.un("write", this.onWrite, this)
						}
						if (a) {
							a.on("write", this.onWrite, this)
						}
						this.store = a
					},
					onStoreAdd : function(c, b, a) {
						var e = Ext.isArray(b) ? b[0] : b;
						if (e.phantom) {
							return
						}
						this.hideEditForm()
					},
					onStoreUpdate : function(b, c, a) {
						if (a == Ext.data.Record.COMMIT) {
							this.hideEditForm()
						}
					},
					onStoreRemove : function(a, b) {
						this.hideEditForm()
					},
					onWrite : function(a, c, b, f, e) {
						switch (c) {
						case "create":
							this.onStoreAdd(a, e);
							break;
						case "update":
							this.onStoreUpdate(a, e, Ext.data.Record.COMMIT);
							break;
						case "destroy":
							this.onStoreRemove(a, e);
							break
						}
					},
					onEditDetails : function(b, c, a) {
						if (this.fireEvent("editdetails", this, b, c, a) !== false) {
							this.showEditForm(c)
						}
					},
					save : function() {
						if (!this.store.autoSave) {
							this.store.save()
						}
					},
					onEventAdd : function(a, b) {
						if (!b.store) {
							this.store.add(b);
							this.save()
						}
						this.fireEvent("eventadd", this, b)
					},
					onEventUpdate : function(a, b) {
						this.save();
						this.fireEvent("eventupdate", this, b)
					},
					onEventDelete : function(a, b) {
						this.store.remove(b);
						this.save();
						this.fireEvent("eventdelete", this, b)
					},
					onEventCancel : function(a, b) {
						this.hideEditForm();
						this.fireEvent("eventcancel", this, b)
					},
					showEditForm : function(a) {
						this.preEditView = this.layout.activeItem.id;
						this.setActiveView(this.id + "-edit");
						this.layout.activeItem.loadRecord(a);
						return this
					},
					hideEditForm : function() {
						if (this.preEditView) {
							this.setActiveView(this.preEditView);
							delete this.preEditView
						}
						return this
					},
					setActiveView : function(g, a) {
						var f = this, e = f.layout, b = f.id + "-edit", c;
						if (a) {
							f.startDate = a
						}
						if (g !== e.activeItem.id) {
							c = f.getTopToolbar();
							if (c) {
								c[g === b ? "hide" : "show"]()
							}
							e.setActiveItem(g || f.activeItem);
							f.doLayout();
							f.activeView = e.activeItem;
							if (g !== b) {
								if (g && g !== f.preEditView) {
									e.activeItem
											.setStartDate(f.startDate, true)
								}
								f.updateNavState()
							}
							f.fireViewChange()
						}
					},
					fireViewChange : function() {
						var c = null, a = this.layout.activeItem;
						if (a.getViewBounds) {
							var b = a.getViewBounds(), c = {
								activeDate : a.getStartDate(),
								viewStart : b.start,
								viewEnd : b.end
							}
						}
						if (a.dismissEventEditor) {
							a.dismissEventEditor()
						}
						this.fireEvent("viewchange", this, a, c)
					},
					updateNavState : function() {
						var b = this, e = b.layout.activeItem;
						if (e && b.showNavBar !== false) {
							var c = e.id.split(b.id + "-")[1], a = Ext
									.getCmp(b.id + "-tb-" + c);
							if (b.showNavToday) {
								Ext.getCmp(b.id + "-tb-today").setDisabled(
										e.isToday())
							}
							a.toggle(true)
						}
					},
					setStartDate : function(a) {
						Ext.ensible.log("setStartDate (CalendarPanel");
						this.startDate = a;
						this.layout.activeItem.setStartDate(a, true);
						this.updateNavState();
						this.fireViewChange();
						return this
					},
					showWeek : function(a) {
						this.setActiveView(this.id + "-week", a)
					},
					onTodayClick : function() {
						this.startDate = this.layout.activeItem.moveToday(true);
						this.updateNavState();
						this.fireViewChange()
					},
					onJumpClick : function() {
						var a = Ext.getCmp(this.id + "-tb-jump-dt").getValue();
						if (a !== "") {
							this.startDate = this.layout.activeItem.moveTo(a,
									true);
							this.updateNavState();
							this.fireViewChange()
						}
					},
					onPrevClick : function() {
						this.startDate = this.layout.activeItem.movePrev(true);
						this.updateNavState();
						this.fireViewChange()
					},
					onNextClick : function() {
						this.startDate = this.layout.activeItem.moveNext(true);
						this.updateNavState();
						this.fireViewChange()
					},
					onDayNavClick : function() {
						this.setActiveView(this.id + "-day")
					},
					onMultiDayNavClick : function() {
						this.setActiveView(this.id + "-multiday")
					},
					onWeekNavClick : function() {
						this.setActiveView(this.id + "-week")
					},
					onMultiWeekNavClick : function() {
						this.setActiveView(this.id + "-multiweek")
					},
					onMonthNavClick : function() {
						this.setActiveView(this.id + "-month")
					},
					getActiveView : function() {
						return this.layout.activeItem
					}
				});
Ext.reg("extensible.calendarpanel", Ext.ensible.cal.CalendarPanel);
/*!
 * Extensible 1.0
 * Copyright(c) 2010-2011 Extensible, LLC
 * licensing@ext.ensible.com
 * http://ext.ensible.com
 */
/*
 * Chinese(zh-cn) By frank cheung v0.1
 * encoding: utf-8
 */

Ext.ensible.Date.use24HourTime = false;

if(Ext.ensible.cal.CalendarView) {
    Ext.apply(Ext.ensible.cal.CalendarView.prototype, {
        startDay: 0,
        todayText: '今日',
        defaultEventTitleText: '(没标题)',
        ddCreateEventText: '为{0}创建事件',
        ddMoveEventText: '移动事件到{0}',
        ddResizeEventText: '更新事件到{0}'
    });
}

if(Ext.ensible.cal.MonthView) {
    Ext.apply(Ext.ensible.cal.MonthView.prototype, {
        moreText: '+{0}更多……',
        detailsTitleDateFormat: 'F j'
    });
}

if(Ext.ensible.cal.CalendarPanel) {
    Ext.apply(Ext.ensible.cal.CalendarPanel.prototype, {
        todayText: '今日',
        dayText: '日',
        weekText: '星期',
        monthText: '月',
        jumpToText: '调到：',
        goText: '到 ',
        multiDayText: '{0}天',
        multiWeekText: '{0}星期'
    });
}

if(Ext.ensible.cal.EventEditWindow) {
    Ext.apply(Ext.ensible.cal.EventEditWindow.prototype, {
        width: 600,
        labelWidth: 65,
        titleTextAdd: '添加事件',
        titleTextEdit: '编辑事件',
        savingMessage: '保存更改……',
        deletingMessage: '删除事件……',
        detailsLinkText: '编辑详细……',
        saveButtonText: '保存',
        deleteButtonText: '删除',
        cancelButtonText: '取消',
        titleLabelText: '标题',
        datesLabelText: '当在',
        calendarLabelText: '日历'
    });
}

if(Ext.ensible.cal.EventEditForm) {
    Ext.apply(Ext.ensible.cal.EventEditForm.prototype, {
        labelWidth: 65,
        labelWidthRightCol: 65,
        title: '事件来自',
        titleTextAdd: '添加事件',
        titleTextEdit: '编辑事件',
        saveButtonText: '保存',
        deleteButtonText: '删除',
        cancelButtonText: '取消',
        titleLabelText: '标题',
        datesLabelText: '当在',
        reminderLabelText: '提醒器',
        notesLabelText: '便笺',
        locationLabelText: '位置',
        webLinkLabelText: 'Web链接',
        calendarLabelText: '日历',
        repeatsLabelText: '重复'
    });
}

if(Ext.ensible.cal.DateRangeField) {
    Ext.apply(Ext.ensible.cal.DateRangeField.prototype, {
        toText: '到',
        allDayText: '全天'
    });
}

if(Ext.ensible.cal.CalendarCombo) {
    Ext.apply(Ext.ensible.cal.CalendarCombo.prototype, {
        fieldLabel: '日历'
    });
}

if(Ext.ensible.cal.CalendarList) {
    Ext.apply(Ext.ensible.cal.CalendarList.prototype, {
        title: '日历'
    });
}

if(Ext.ensible.cal.CalendarListMenu) {
    Ext.apply(Ext.ensible.cal.CalendarListMenu.prototype, {
        displayOnlyThisCalendarText: '只显示该日历'
    });
}

if(Ext.ensible.cal.RecurrenceCombo) {
    Ext.apply(Ext.ensible.cal.RecurrenceCombo.prototype, {
        fieldLabel: '重复',
        recurrenceText: {
            none: '不重复',
            daily: '每天',
            weekly: '每星期',
            monthly: '每月',
            yearly: '每年'
        }
    });
}

if(Ext.ensible.cal.ReminderField) {
    Ext.apply(Ext.ensible.cal.ReminderField.prototype, {
        fieldLabel: '提醒器',
        noneText: '没有',
        atStartTimeText: '于启动时间',
        minutesText: '分钟',
        hourText: '小时',
        hoursText: '小时',
        dayText: '天',
        daysText: '天',
        weekText: '星期',
        weeksText: '星期',
        reminderValueFormat: '离开始还有{0} {1}' // e.g. "2 hours before start"
    });
}

if(Ext.ensible.cal.DateRangeField) {
    Ext.apply(Ext.ensible.cal.DateRangeField.prototype, {
        dateFormat: 'n/j/Y'
    });
}

if(Ext.ensible.cal.EventContextMenu) {
    Ext.apply(Ext.ensible.cal.EventContextMenu.prototype, {
        editDetailsText: '编辑详细',
        deleteText: '删除',
        moveToText: '移动到……'
    });
}

if(Ext.ensible.cal.DropZone) {
    Ext.apply(Ext.ensible.cal.DropZone.prototype, {
        dateRangeFormat: '{0}-{1}',
        dateFormat: 'n/j'
    });
}

if(Ext.ensible.cal.DayViewDropZone) {
    Ext.apply(Ext.ensible.cal.DayViewDropZone.prototype, {
        dateRangeFormat: '{0}-{1}',
        dateFormat : 'n/j'
    });
}

if(Ext.ensible.cal.BoxLayoutTemplate) {
    Ext.apply(Ext.ensible.cal.BoxLayoutTemplate.prototype, {
        firstWeekDateFormat: 'D j',
        otherWeeksDateFormat: 'j',
        singleDayDateFormat: 'l, F j, Y',
        multiDayFirstDayFormat: 'M j, Y',
        multiDayMonthStartFormat: 'M j'
    });
}

if(Ext.ensible.cal.MonthViewTemplate) {
    Ext.apply(Ext.ensible.cal.MonthViewTemplate.prototype, {
        dayHeaderFormat: 'D',
        dayHeaderTitleFormat: 'l, F j, Y'
    });
}