// #region - iTech {}
const _ = " ";

const iTech = {
	Version: "6.4.21",
	Services: {
		Ajax: (
			$type = FormMethod.Post,
			$url,
			$requestData = {},
			$useToken = true,
			$async = false,
			$contentType,
			$encrypt = false
		) => {
			try {
				var result = {};
				$.ajax({
					url: iTech.Defaults.ApiBaseUrl + $url,
					type: $type,
					async: false,
					contentType: $contentType,
					data: $requestData,
					beforeSend: function (jqXhr) {
						//if ($("button[data-role='save']").length) {
						//    $("button[data-role='save']").css("pointer-events", "none");
						//}

						if ($encrypt) jqXhr.setRequestHeader("ControlValue", iTech.Helpers.sifrele("ID"));
						if ($useToken) {
							jqXhr.setRequestHeader("Authorization", "Bearer " + iTech.User.GetToken());
						}
					},
					success: (data, Textstatus, jqXHR) => {
						/* {
                            success: false,
                            message:"",
                            data:data
*                        }*/
						result.success = true;
						result.message = "";
						if (data != null)
							if (data.errors) {
								result.success = false;
								result.message = data.errors.join();
							} else result.data = data;
						else result.success = false;
					},
					error: (jqXHR, textStatus, errorThrown) => {
						result.success = false;
						result.message = jqXHR;
					},
				});
			} catch (e) {
				console.log(e);
			}

			return result;
		},
		AjaxCrypt: (
			$type = FormMethod.Post,
			$url,
			$requestData = {},
			$useToken = true,
			$async = false,
			$contentType,
			$encrypt = true
		) => {
			try {
				var result = {};
				$.ajax({
					url: iTech.Defaults.ApiBaseUrl + $url,
					type: $type,
					async: false,
					contentType: $contentType,
					data: $requestData,
					beforeSend: function (jqXhr) {
						//if ($("button[data-role='save']").length) {
						//    $("button[data-role='save']").css("pointer-events", "none");
						//}

						if ($encrypt) jqXhr.setRequestHeader("ControlValue", iTech.Helpers.sifrele("ID"));
						if ($useToken) {
							jqXhr.setRequestHeader("Authorization", "Bearer " + iTech.User.GetToken());
						}
					},
					success: (data, Textstatus, jqXHR) => {
						result.success = true;
						result.message = "";
						if (data != null)
							if (data.errors) {
								result.success = false;
								result.message = data.errors.join();
							} else result.data = data;
						else result.success = false;
					},
					error: (err) => {
						iTech.UI.ShowValidationMessages(err.status, err.responseJSON, err.responseText);
						result.success = false;
						result.message = err;
					},
				});
			} catch (e) {
				console.log(e);
			}

			return result;
		},
		ExtService: (
			$type = FormMethod.Post,
			$url,
			$requestData = {},
			$useToken = true,
			$async = false,
			$contentType,
			$encrypt = false
		) => {
			try {
				var result = {};
				$.ajax({
					url: $url,
					type: $type,
					async: false,
					contentType: $contentType,
					data: $requestData,
					beforeSend: function (jqXhr) {
						//if ($("button[data-role='save']").length) {
						//    $("button[data-role='save']").css("pointer-events", "none");
						//}
						if ($useToken) {
							jqXhr.setRequestHeader("Authorization", "Bearer " + iTech.User.GetToken());
						}
					},
					success: (data, Textstatus, jqXHR) => {
						result.success = true;
						result.message = "";
						if (data != null)
							if (data.errors) {
								result.success = false;
								result.message = data.errors.join();
							} else result.data = data;
						else result.success = false;
					},
					error: (err) => {
						iTech.UI.ShowValidationMessages(err.status, err.responseJSON, err.responseText);
						result.success = false;
						result.message = err;
					},
				});
			} catch (e) {
				console.log(e);
			}

			return result;
		},
	},
	Helpers: {
		toShortDate: function (value, format = "DD/MM/YYYY") {
			if (!value) return "";
			var dateValue;
			try {
				dateValue = moment(value).format("DD/MM/YYYY");
			} catch (e) {
				dateValue = "";
			}
			return dateValue;
		},
		sifrele: function (value) {
			var formData = { sText: value };
			var result = iTech.Services.Ajax(FormMethod.Post, "Predefined/Sifrele", formData);
			if (result.success) return result.data;
			else return "";
		},
		setDate: function (dateValue) {
			return dateValue.Yil + "-" + dateValue.Ay + "-" + dateValue.Gun;
		},
		downloadBase64File: function (contentType, base64Data, fileName) {
			const linkSource = `data:${contentType};base64,${base64Data}`;
			const downloadLink = document.createElement("a");
			downloadLink.href = linkSource;
			downloadLink.download = fileName;
			downloadLink.click();
		},
		FilterCombo: function (comboName, filterText) {
			var names = $("#" + comboName + " option").clone();

			$("#" + comboName).empty();
			names
				.filter(function (idx, el) {
					return (
						filterText === "ALL" ||
						$(el)
							.text()
							.indexOf("[" + filterText + "]") >= 0
					);
				})
				.appendTo("#" + comboName);
		},
		BetweenDates: function (startingDate, endingDate) {
			var startDate = new Date(new Date(startingDate).toISOString().substr(0, 10));
			if (!endingDate) {
				endingDate = new Date().toISOString().substr(0, 10); // need date in YYYY-MM-DD format
			}
			var endDate = new Date(endingDate);
			if (startDate > endDate) {
				var swap = startDate;
				startDate = endDate;
				endDate = swap;
			}
			var startYear = startDate.getFullYear();
			var february = (startYear % 4 === 0 && startYear % 100 !== 0) || startYear % 400 === 0 ? 29 : 28;
			var daysInMonth = [31, february, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

			var yearDiff = endDate.getFullYear() - startYear;
			var monthDiff = endDate.getMonth() - startDate.getMonth();
			if (monthDiff < 0) {
				yearDiff--;
				monthDiff += 12;
			}
			var dayDiff = endDate.getDate() - startDate.getDate();
			if (dayDiff < 0) {
				if (monthDiff > 0) {
					monthDiff--;
				} else {
					yearDiff--;
					monthDiff = 11;
				}
				dayDiff += daysInMonth[startDate.getMonth()];
			}

			return yearDiff + " Yıl " + monthDiff + " Ay " + dayDiff + " Gün";
		},
		isOdd: function (num) {
			return !(num % 2);
		},
		isEmpty: function (param) {
			var r;
			const pType = typeof param;
			switch (pType) {
				case "undefined": // ("found undefined");
					r = true;
					break;
				case "object": // ("found obj");
					if (param == null)
						// ("found null object");
						r = true;
					// ("found empty obj {}");
					else r = Object.keys(param).length == 0; //
					break;
				case "string": // ("found string");
					r = param.length == 0;
				default: // "not Empty"
					r = false;
					break;
			}
			return r;
		},
		isGuid: function (s) {
			return !(iTech.isEmpty(s) || s === "" || s === emptyGuid);
		},
		GetUrlParameter: function (sParam, decoding = true) {
			// ext
			const sPageUrl = window.location.search.substring(1);
			const sUrlVariables = sPageUrl.split("&");
			var sParameterName, i;

			for (i = 0; i < sUrlVariables.length; i++) {
				sParameterName = sUrlVariables[i].split("=");

				if (sParameterName[0] === sParam) {
					return false ? true : decoding ? decodeURIComponent(sParameterName[1]) : sParameterName[1];
				}
			}
			return false;
		},
		SetComboText: function (comboName, text) {
			$("#" + comboName + " option")
				.filter(function () {
					return $(this).text() == text;
				})
				.prop("selected", true);
		},
		SetComboItemText: function (comboText, text) {
			$(comboText + " option")
				.filter(function () {
					return $(this).text() == text;
				})
				.prop("selected", true);
		},
		GetCurrentPage: function (withParameters = false) {
			return window.location.pathname === "/"
				? "/Account/Login"
				: withParameters
				? window.location.pathname + window.location.search
				: window.location.pathname;

			//return (window.location.pathname === "/")
			//    ? "/Account/Login"
			//    : window.location.pathname;
		},
		ValidateForm: function ($formName) {
			//const requireds = $("form[name='" + $formName + "'] :required");
			const requireds = $("form[name='" + $formName + "'] :required").filter(
				(i, htmlEl) => $(htmlEl).css("visibility") !== "hidden"
			);
			let $this,
				$result = true;
			const requiredLength = requireds.length;
			let confirmedCounter = 0;
			requireds.each(function (index, htmlEl) {
				let $message = "";
				$this = $(this);
				$this.css("border", "1px solid #E5E5E5");

				const lbl = $this.closest("form").find(`label[for='${$this.attr("name")}']`);
				lbl.find("small").remove();

				$result = $this.get(0).validity.valid;
				if ($(htmlEl).get(0).tagName == "SELECT") {
					if ($(htmlEl).get(0).id.indexOf(".") > 0) {
						var idEl = $(htmlEl).get(0).id.replace(".", "\\.");
						$("#select2-" + idEl + "-container")
							.parent()
							.css("border", "1px solid #E5E5E5");
					}
					if ($(htmlEl).get(0).id.indexOf(".") < 0) {
						var idEl = $(htmlEl).get(0).id;
						$("#select2-" + idEl + "-container")
							.parent()
							.css("border", "1px solid #E5E5E5");
					}
				}

				// inputMasks
				if ($this.data("inputmask")) {
					var maskedValue = $this.data("inputmask").split(":")[1].replace(/['-]/g, "").trim();
					var inputValue = $this.val().replace(/['_-]/g, "");
					if (inputValue.length != maskedValue.length) $result = false;
				}
				if ($this.hasAttr("minlength")) {
					$result = $this.attr("minlength") == $this.val().length;
				}

				if (!$result) {
					$message = _ + "<small class='text-danger font-italic'> (*) </small>";
					$this.css("border", "1px solid red");
					// FlatPickr (DateTime Picker), bizim insert'i hidden yaptığı için sonraki elemente border verildi
					if ($this.hasClass("flatpickr-input")) {
						$this.next().css("border", "1px solid red");
					}

					if ($(htmlEl).get(0).tagName == "SELECT") {
						if ($(htmlEl).get(0).id.indexOf(".") > 0) {
							var idEl = $(htmlEl).get(0).id.replace(".", "\\.");
							$("#select2-" + idEl + "-container")
								.parent()
								.css("border", "1px solid red");
						}
						if ($(htmlEl).get(0).id.indexOf(".") < 0) {
							var idEl = $(htmlEl).get(0).id;
							$("#select2-" + idEl + "-container")
								.parent()
								.css("border", "1px solid red");
						}
					}
				} else confirmedCounter++;

				lbl.append($message);
			});

			if (confirmedCounter != requiredLength) {
				iTech.ShowMessage("UYARI", "Eksik Alan(lar) Mevcut!", "warning");
				return false;
			}

			return true;
		},
		ValidatePrivate: function ($formName, requiredText) {
			// const requireds = $("form[name='" + $formName + "'] :required");
			const requireds = $(
				"form[name='" + $formName + "'] *[data-required='" + requiredText + "'],form[name='" + $formName + "'] :required"
			).filter((i, htmlEl) => $(htmlEl).css("visibility") !== "hidden");
			let $this,
				$result = true;
			const requiredLength = requireds.length;
			//$("form[name='" + $formName + "'] span").remove();
			let confirmedCounter = 0;

			requireds.each(function (index, htmlEl) {
				let $message = "";
				$this = $(htmlEl);
				console.log($(htmlEl));
				$this.css("border", "1px solid #E5E5E5");

				if ($this.hasClass("flatpickr-input")) {
					$this.next().css("border", "1px solid #E5E5E5");
				}

				if ($(htmlEl).get(0).tagName == "SELECT") {
					$(htmlEl).next(".select2-container").css("border", "1px solid #E5E5E5");
					//if (($(htmlEl).get(0).id).indexOf(".") > 0) {
					//    var idEl = ($(htmlEl).get(0).id).replace(".", "\\.");
					//    $("#select2-" + idEl + "-container").parent().css("border", "1px solid #E5E5E5");
					//}
					//if (($(htmlEl).get(0).id).indexOf(".") < 0) {
					//    var idEl = ($(htmlEl).get(0).id);
					//    $("#select2-" + idEl + "-container").parent().css("border", "1px solid #E5E5E5");
					//}
				}

				const lbl = $this.closest("form").find(`label[for='${$this.attr("name")}']`);
				lbl.find("small").remove();

				if ($this.hasAttr("minlength")) {
					$result = $this.attr("minlength") == $this.val().length;
				}

				// inputMasks
				if ($this.data("inputmask")) {
					var maskedValue = $this.data("inputmask").split(":")[1].replace(/['-]/g, "").trim();
					var inputValue = $this.val().replace(/['_-]/g, "");
					if (inputValue.length != maskedValue.length) $result = false;
				}

				const hasRequiredAttr = htmlEl.hasAttribute("required");
				if (hasRequiredAttr) $result = $this.get(0).validity.valid; //required
				else $result = $this.get(0).value.length; // data-required için konfirmasyon.

				if (!$result) {
					$message = _ + "<small class='text-danger font-italic'> (*) </small>";
					$this.css("border", "1px solid red");

					// FlatPickr (DateTime Picker), bizim insert'i hidden yaptığı için sonraki elemente border verildi
					if ($this.hasClass("flatpickr-input")) {
						$this.next().css("border", "1px solid red");
					}

					// Select2, select span'a dönüştüğü için başka bir elemente border verildi
					if ($(htmlEl).get(0).tagName == "SELECT") {
						$(htmlEl).next(".select2-container").css("border", "1px solid red");

						//if (($(htmlEl).get(0).id).indexOf(".") > 0) {
						//    var idEl = ($(htmlEl).get(0).id).replace(".", "\\.");
						//    $("#select2-" + idEl + "-container").parent().css("border", "1px solid red");
						//}
						//if (($(htmlEl).get(0).id).indexOf(".") < 0) {
						//    var idEl = ($(htmlEl).get(0).id);
						//    $("#select2-" + idEl + "-container").parent().css("border", "1px solid red");
						//}
					}
				} else confirmedCounter++;
			});

			if (confirmedCounter != requiredLength) {
				iTech.ShowMessage("UYARI", "Eksik Alan(lar) Mevcut!", "warning");
				return false;
			}

			var validationResult = confirmedCounter === requiredLength;
			return validationResult;
		},
		/**
		 * @param {string} targetForm  Temizlencecek formun id parametresi "Form"
		 * @param {boolean} isDNone    Formun içinde yalnızca d-none olan alanlara silmek için kullanıyoruz
		 */
		ClearForm: function (targetForm, isDNone = false) {
			debugger;
			let target;
			var AllTargets = targetForm.split(",");
			AllTargets.forEach(ClearTarget);
			function ClearTarget(item) {
				// Eğer targetForm içerisine gönderilen değer bir class veya id selector ise
				if (item[0] === "#" || item[0] === ".") target = $(item);
				else {
					if (isDNone) {
						target = $("form[name='" + item + "Form'] .d-none");
					} else {
						target = $("form[name='" + item + "Form']");
					}
				}

				target
					.find("span")
					.filter((i, el) => {
						$(el).hasClass("select2") ? el : false;
					})
					.text("");
				target.find("small").text("");
				target
					.find("input,textarea,select")
					.filter((i, el) => !el.hasAttribute("data-fixedvalue"))
					.val("");

				const inputs = target.find("input,select,textarea,p,img").filter((i, el) => el.type !== "hidden");
				$.each(inputs, (i, htmlEl) => {
					const el = $(htmlEl);

					// Test Etmek İçin SİLİNMESİN!!
					//if (el[0] == $("#terfiGirisTip")[0])

					//#region Default border
					el.css("border", "1px solid #E5E5E5");

					const lbl = el.closest("form").find(`label[for='${el.attr("name")}']`);
					lbl.find("small").remove();

					if (el.get(0).tagName == "SELECT") {
						if (el.get(0).id.indexOf(".") > 0) {
							var idEl = el.get(0).id.replace(".", "\\.");
							$("#select2-" + idEl + "-container")
								.parent()
								.css("border", "1px solid #E5E5E5");
						}
						if ($(htmlEl).get(0).id.indexOf(".") < 0) {
							var idEl = el.get(0).id;
							$("#select2-" + idEl + "-container")
								.parent()
								.css("border", "1px solid #E5E5E5");
						}
					}
					//#endregion

					if (el.is("select")) {
						if (!el.hasAttr("data-fixedvalue")) {
							var defaultText = $(htmlEl).attr("text") != null;
							if (!defaultText) el.val("").trigger("change");
						}
					}

					// Switch
					if (el.attr("type") == "checkbox") {
						var temp = el.closest("div").attr("switch-text");
						var defaultCheck = temp.split(":")[1];
						el.prop("checked", false);
						el.siblings().text(defaultCheck);
					}

					// input number
					if (el.attr("type") == "number") {
						if (el.data("fixedvalue")) {
							const fixedValue = el.data("fixedvalue");
							el.val(fixedValue);
						}
					}

					if (el.is("textarea")) {
					}

					// image
					if ($(htmlEl).is("img")) {
						el.attr("src", "/app/images/profil.jpg");
					}

					// flatpickr
					if (el.hasClass("flatpickr")) {
						if ($(el).siblings().attr("data-fixedDate") == "today") {
							iTech.FlatPicker.Init($(el).siblings());
						}
					}
				});
			}
		},
		SetMapBySelector: function (value, key, selector) {
			key = key.charAt(0).toUpperCase() + key.substr(1); // İlk Harf Büyük Karaktere çevirilir.
			let el = "";

			selector.includes("Form")
				? (el = $("form[name='" + selector + "'] *[name='" + key + "']"))
				: (el = $(selector + " [name='" + key + "']").val(value));

			if (value != null) {
				// default
				el.val(value);

				// Switch
				if (el.eq(0).attr("type") == "checkbox") {
					//if (el.eq(0).data("default")) value = el.eq(0).attr("value");
					iTech.SwitchTexts.SetText(el, value);
					return;
				}
				// DateTime
				if (el.eq(0).attr("type") == "hidden" && el.eq(0).hasClass("flatpickr")) {
					//if (el.eq(0).data("default")) value = el.eq(0).attr("value");
					iTech.FlatPicker.Init(el, value, true);
					return;
				}

				if (!el.eq(0).hasClass("flatpickr") && value != null && key.includes("Tarih")) {
					value = moment.utc(value).format("DD.MM.YYYY");
				}

				// Select
				if (el.eq(0).is("select")) {
					//if (el.eq(0).data("default")) value = el.eq(0).attr("value");
					el.trigger("change");
					return;
				}

				if (el.eq(0).is("span")) {
					if (el.eq(0).hasClass("currency")) el.text(iTech.Helpers.formatMoney(value));
					else el.text(value);
					return;
				}
				if (el.eq(0).is("small")) {
					if (el.eq(0).hasClass("currency")) el.text(iTech.Helpers.formatMoney(value));
					else el.text(value);
					return;
				}
			}
		},
		Map: function (selector, data) {
			Object.keys(data).map((key) => {
				// name'lerine göre value atayacak.
				const value = data[key];
				const pType = typeof value;
				if (value == null || pType != "object") {
					iTech.Helpers.SetMapBySelector(value, key, selector);
				} else {
					Object.keys(value).map((keychild) => {
						// name'lerine göre value atayacak.
						const valueChild = value[keychild];
						keychild = keychild.charAt(0).toUpperCase() + keychild.substr(1);
						iTech.Helpers.SetMapBySelector(valueChild, key + "." + keychild, selector);
					});
				}
			});
		},
		ReadJson: function (url) {
			var result = null;
			$.ajax({
				url: url,
				type: "GET",
				async: false,
				error: function (xhr, ajaxOptions, thrownError) {
					result = xhr;
				},
			})
				.done(function (data, textStatus, jqXhr) {
					result = data;
				})
				.fail(function (jqXhr) {
					result = jqXhr;
				});
			return result;
		},
		SwitchDisplay: function (element, targetElements, expectedValue, visible = false) {
			const targetElementsArr = targetElements.split(",");
			$.each(targetElementsArr, (index, htmlElement) => {
				var isNone = true;
				const elementValue = $(element).val();

				if (expectedValue.includes(elementValue)) {
					isNone = false;
				}
				if (isNone) $(htmlElement).removeClass("d-none");
				else {
					if (!$(htmlElement).hasClass("d-none")) $(htmlElement).addClass("d-none");
				}
			});
			//const targetElementsArr = targetElements.split(",");
			//$.each(targetElementsArr, (index, htmlElement) => {
			//    var visCondition = "hidden";
			//    if (visible && elementValue == expectedValue)
			//        visCondition = "visible";
			//    else if (!visible && elementValue != expectedValue)
			//        visCondition = "visible";
			//    else if (elementValue != expectedValue)
			//        $(htmlElement).siblings().prop("disabled", false);
			//    if (disabled && elementValue == expectedValue) {
			//        if ($(htmlElement).hasClass("flatpickr")) {
			//            $(htmlElement).siblings().val("");
			//            $(htmlElement).siblings().prop("disabled", true);
			//        }
			//        else {
			//            $(htmlElement).val("");
			//            $(htmlElement).prop("disabled", true);
			//        }
			//    }
			//    $(htmlElement).css("visibility", visCondition);
			//});
		},
		IsUndefined: function (q) {
			return typeof q === typeof undefined;
		},
		Slugify: function (sName, pName = "") {
			let dataFilter;
			sName = sName.replaceAll("İ", "I");
			sName = sName.replaceAll("Ü", "U");
			sName = sName.replaceAll("Ç", "C");
			sName = sName.replaceAll("Ö", "O");
			sName = sName.replaceAll("Ş", "S");
			sName = sName.replaceAll("Ğ", "G");
			sName = sName.replaceAll("ı", "i");
			sName = sName.replaceAll("ü", "u");
			sName = sName.replaceAll("ç", "c");
			sName = sName.replaceAll("ö", "o");
			sName = sName.replaceAll("ş", "s");
			sName = sName.replaceAll("ğ", "g");
			if (pName !== null) {
				pName = pName.replaceAll("İ", "I");
				pName = pName.replaceAll("Ü", "U");
				pName = pName.replaceAll("Ç", "C");
				pName = pName.replaceAll("Ö", "O");
				pName = pName.replaceAll("Ş", "S");
				pName = pName.replaceAll("Ğ", "G");
				pName = pName.replaceAll("ı", "i");
				pName = pName.replaceAll("ü", "u");
				pName = pName.replaceAll("ç", "c");
				pName = pName.replaceAll("ö", "o");
				pName = pName.replaceAll("ş", "s");
				pName = pName.replaceAll("ğ", "g");
			}
			pName === null ? (dataFilter = sName) : (dataFilter = pName + " " + sName);
			return dataFilter.toLowerCase();
			//.replaceAll("ç", "c")
			//.replaceAll("ı", "i")
			//.replaceAll("ö", "o")
			//.replaceAll("ü", "u")
			//.replaceAll("ş", "s")
			//.replaceAll("ğ", "g")

			// Bu iki arkadaşı kullanmayalım.
			//.replaceAll("?", "_")
			//.replaceAll(/ /g, '-')
			//.replaceAll(/[^\w-]+/g, '')
		},
		Debounce: function (func, timeout = 300) {
			let timer;
			return (...args) => {
				clearTimeout(timer);
				timer = setTimeout(() => {
					func.apply(this, args);
				}, timeout);
			};
		},
		HasElementEvent: (elementId, eventList) => {
			var element = $(`#${elementId}`).get(0);
			var elementEvents = $._data(element, "events");
			//$.each(elementEvents, (i, event) => {
			//    console.log(i, "i");
			//    console.log(event, "event");
			//});
		},
		formatMoney: function (num) {
			if (num && !isNaN(num)) {
				var p = num.toFixed(2).split(".");
				return (
					p[0]
						.split("")
						.reverse()
						.reduce(function (acc, num, i, orig) {
							return num + (num != "-" && i && !(i % 3) ? "." : "") + acc;
						}, "") +
					"," +
					p[1]
				);
			} else return "0.00";
		},
		ConvertToAramaParametre: function (elements) {
			var requestData = { aramaKriter: [] };
			$.each(elements, (i, htmlEl) => {
				var aramaParametreDto = {};
				var el = $(htmlEl);

				if (el.attr("name") === undefined) return;
				aramaParametreDto.aranacakDeger = el.val();
				aramaParametreDto.kolonAd = el.attr("name");
				aramaParametreDto.veriTipi = "string";
				aramaParametreDto.aramaTipi = 20;
				if (el.is("select")) {
					if (el.val() == null || !el.val().length) return;
					//if ($(el).attr("data-searchType") == 'bool') {
					aramaParametreDto.veriTipi = "number";
					// }
					if ($(el).attr("data-searchType") == "bool") {
						aramaParametreDto.veriTipi = "bool";
						aramaParametreDto.aramaTipi = 10;
					}
				}
				if (el.is("input")) {
					if (el.val() == null || !el.val().length) return;

					if (el.attr("type") === "checkbox") {
						aramaParametreDto.aranacakDeger = el.prop("checked");
						aramaParametreDto.veriTipi = "bool";
						aramaParametreDto.aramaTipi = 10;
					}
					if (el.attr("type") === "number") {
						aramaParametreDto.veriTipi = "number";
					}
					if (el.attr("type") === "radio") {
						var oncedenEklenmisMi = $.grep(
							requestData["aramaKriter"],
							(obj) => obj.kolonAd === aramaParametreDto.kolonAd
						).length;
						if (oncedenEklenmisMi) return;

						aramaParametreDto.aranacakDeger = el.parent().find(":checked").val();
					}

					if (el.hasClass("flatpickr-input")) {
						aramaParametreDto.veriTipi = "date";
						aramaParametreDto.aramaTipi = 10;
						// Tarih aralığı için eklendi. Tarih filtresi yapılacaksa flatpickr içine data-basTar ve data-bitTar eklenecektir.
						//<input type="date" id="BasTarih" name="BasTarih" data-basTar class="form-control form-control-xs flatpickr" />
						if (el.hasAttr("data-basTar")) {
							aramaParametreDto.aramaTipi = 40;
						} else if (el.hasAttr("data-bitTar")) {
							aramaParametreDto.aramaTipi = 30;
						}

						if (el.hasAttr("data-together")) {
							var bas = moment($(el).val()).format("YYYY-MM-DD");

							let togetherDate;
							if (el.hasAttr("data-basTar")) {
								togetherDate = $($(el).closest(".row").find("input")[2]);
							} else {
								togetherDate = $($(el).closest(".row").find("input")[0]);
							}

							if (togetherDate.val() != "" && $(el).val() != "") {
								var son = moment(togetherDate.val()).format("YYYY-MM-DD");
								aramaParametreDto.aranacakDeger = bas + "/" + son;
								aramaParametreDto.kolonAd += "/" + togetherDate.attr("id");
								aramaParametreDto.aramaTipi = 50;

								var testTogether =
									aramaParametreDto.kolonAd.split("/")[1].toString() + "/" + aramaParametreDto.kolonAd.split("/")[0].toString();
								if (requestData["aramaKriter"].find((x) => x.kolonAd == testTogether)) return;
							}
						}
					}

					// Geliştirilecek
					//if ($(el).hasAttr('date-rangepickr')) {
					//    aramaParametreDto.veriTipi = "date";
					//    var bas = moment($(el).val().split(" - ")[0], "DD/MM/YYYY").format("YYYY-MM-DD");
					//    var son = moment($(el).val().split(" - ")[1], "DD/MM/YYYY").format("YYYY-MM-DD");
					//    aramaParametreDto.aranacakDeger = bas + "/" + son;
					//    aramaParametreDto.aramaTipi = 50;
					//}
				}
				if ($(el).hasAttr("data-filtercolname")) {
					const tableData = $(el).DataTable().rows(".selected").data()[0];

					if (tableData !== undefined) {
						aramaParametreDto.veriTipi = "number";
						const selectedItems = $(el).DataTable().rows(".selected").data();

						let arrayToSend = [];
						$.each(selectedItems, (i, obj) => {
							arrayToSend.push(obj[$(el).attr("data-filtercolname")]);
						});

						aramaParametreDto.aranacakDeger = arrayToSend;
					}
				}

				if ($(el).hasAttr("data-filterTree")) {
					const treeArray = $(el)
						.jstree("get_selected")
						.filter((x) => x != 1);
					if (treeArray.length > 0) {
						aramaParametreDto.veriTipi = "number";
						aramaParametreDto.aranacakDeger = treeArray;
					}
				}

				if (aramaParametreDto.veriTipi == "number") aramaParametreDto.aramaTipi = 10;

				if (
					aramaParametreDto.aranacakDeger !== null &&
					aramaParametreDto.aranacakDeger !== "" &&
					$(el).attr("data-searchType") !== "none"
				)
					requestData["aramaKriter"].push(aramaParametreDto);
			});

			return requestData;
		},
		ObjectKeysRename: function (obj, newKeys) {
			//const obj = { a: "1", b: "2" };
			//const newKeys = { a: "A", c: "C" };
			//const renamedObj = renameKeys(obj, newKeys);
			//console.log(renamedObj);
			// {A:"1", b:"2"}

			//let newObj = {};
			//$.each(Object.entries(obj), (k, v) => {
			//    newObj[v[0]] = v[0] + 'Donusum';
			//});

			const keyValues = Object.keys(obj).map((key) => {
				const newKey = newKeys[key] || key;
				return { [newKey]: obj[key] };
			});
			return Object.assign({}, ...keyValues);
		},
	},
	UI: {
		SetDate: function (targets) {
			// ToDo - multi dateTime olduğunda VAlue'yu nasıl atayacaksın?
			// flatpickr kullanılmaktadır.
			const opt = {
				altInput: true, // kullanıcının göreceği formatı enable eder.
				altFormat: "d/m/Y", // kullanıcının göreceği format
				dateFormat: "Y-m-d", // dbye gönderilecek format,
				allowInput: true,
				onOpen: function (selectedDates, dateStr, instance) {
					$(instance.altInput).prop("readonly", true);
				},
				onClose: function (selectedDates, dateStr, instance) {
					$(instance.altInput).prop("readonly", false);
					$(instance.altInput).blur();
				},
			};
			// virgüle göre split eder, -1 gelir ise bir adet demektir.
			const singleOrMulti = targets.indexOf(",");
			if (!singleOrMulti) {
				// Sayfada bir tane datepicker varsa
				$("#" + targets).flatpickr(opt);
			} else {
				// birden fazla her biri için.
				const htmlElArr = targets.split(",");
				$.each(htmlElArr, function (index, htmlEl) {
					$("#" + htmlEl).flatpickr(opt);
				});
			}
		},
		BootstrapDateRangepicker: function (elements, date = null) {
			$.each(elements, (index, htmlEl) => {
				$(htmlEl).daterangepicker(
					{
						showDropdowns: true,
						showWeekNumbers: true,
						showISOWeekNumbers: true,
						//"timePicker": true,
						//"timePicker24Hour": true,
						//"timePickerSeconds": true,
						autoApply: false,
						startDate: date != null ? date["BeginDate"] : new Date(),
						endDate: date != null ? date["EndDate"] : new Date(new Date().setMonth(new Date().getMonth() + 1)),
						locale: {
							format: "DD/MM/YYYY",
						},
						//locale: {
						//    format: 'M/DD hh:mm A'
						//},
						ranges: {
							Today: [moment(), moment()],
							Yesterday: [moment().subtract(1, "days"), moment().subtract(1, "days")],
							"Last 7 Days": [moment().subtract(6, "days"), moment()],
							"Last 30 Days": [moment().subtract(29, "days"), moment()],
							"This Month": [moment().startOf("month"), moment().endOf("month")],
							"Last Month": [moment().subtract(1, "month").startOf("month"), moment().subtract(1, "month").endOf("month")],
						},
						alwaysShowCalendars: true,
						applyButtonClasses: "btn-default shadow-0",
						cancelClass: "btn-success shadow-0",
					},
					function (start, end, label) {
						//console.log('New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')');
						//console.log("Last Date => ", end.format("DD-MM-YYYY"));
					}
				);
			});
		},
		ShowValidationMessages: function ($code, $errors, $responseText) {
			if ($code === 204) {
				iTech.ShowMessage("Hata", "204 Hatası Mesajları", "error");
			} else if ($code === 400 && typeof $errors === typeof {} && $errors["status"] == undefined) {
				// Invalid
				$.each($errors, function (key, value) {
					key = key.charAt(0).toUpperCase() + key.slice(1);
					const lbl = $("label[for='" + key + "']");
					lbl.find("small").remove();
					const span = "<small class='text-danger font-italic'> * " + value + "(sunucu mesajı)</small>";
					lbl.append(span);
					lbl.next().attr("required", true); // ?
					$("[name='" + key + "']").prop("required", true);
				});
			} else if ($code === 400 && $errors["status"] == 400) {
				// Error
				$errors = $errors.errors;
				$.each($errors, function (key, value) {
					key = key.charAt(0).toUpperCase() + key.slice(1);
					const lbl = $("label[for='" + key + "']");
					lbl.find("small").remove();
					const span = "<small class='text-danger font-italic'> * " + value + "(sunucu mesajı)</small>";
					lbl.append(span);
					lbl.next().attr("required", true); // ?
					$("[name='" + key + "']").prop("required", true);
				});
			} else if ($code === 401) {
				iTech.ShowMessage("Hata", "EPosta / Şifre yanlış veya geçerli bir Rol bulunamadı!", "error");
			} else if ($code === 403) {
				localStorage.removeItem("HRManagement.UserInfo");
				window.reload();
			} else {
				iTech.ShowMessage("Hata", "Veri Bulunamadı", "error");
			}
		},
		BlockElements: function () {
			if ($(_pageElements.ajaxLoaders).length) {
				$.each($(_pageElements.ajaxLoaders), function () {
					$(this).block({
						message:
							"<div class='aLoader bg-transparent'><span class='spinner-border spinner-border-sm bg-transparent' role='status' aria-hidden='true'></span></div>",
						overlayCSS: {
							backgroundColor: "#fff",
							opacity: 0.8,
							cursor: "not-allowed",
						},
						css: {
							cursor: "not-allowed",
							background: "transparent",
							border: 0,
							width: "auto",
							"-webkit-border-radius": 2,
							"-moz-border-radius": 2,
						},
					});
				});
			}
		},
		UnBlockElements: function () {
			if ($(_pageElements.ajaxLoaders).length) {
				$.each($(_pageElements.ajaxLoaders), function () {
					$(this).unblock();
				});
			}
		},
		AskConfirmation: function (
			$title = "Silmek İstediğinize Emin Misiniz?",
			$confirm = "Eminim, Sil!",
			$cancel = "Hayır, İptal Et."
		) {
			return new Promise((resolve, reject) => {
				swal({
					title: $title,
					text: "Bu işlemi geri alamazsınız!",
					type: "warning",
					showCancelButton: true,
					confirmButtonText: $confirm,
					confirmButtonColor: "red",
					cancelButtonText: $cancel,
					cancelButtonClass: "bg-primary text-white",
					allowOutsideClick: false,
					padding: "2em",
				}).then((result) => resolve(result.hasOwnProperty("value")));
			});
		},
		AskConfirm: function (
			$title = "Yapılan İşlemi Onaylıyor Musunuz?",
			$confirm = "Evet, Onaylıyorum.",
			$cancel = "Hayır, İptal Et."
		) {
			return new Promise((resolve, reject) => {
				swal({
					title: $title,
					text: "Bu işlemi geri alamazsınız!",
					type: "warning",
					showCancelButton: true,
					confirmButtonText: $confirm,
					confirmButtonColor: "red",
					cancelButtonText: $cancel,
					cancelButtonClass: "bg-primary text-white",
					allowOutsideClick: false,
					padding: "2em",
				}).then((result) => resolve(result.hasOwnProperty("value")));
			});
		},
		ChangeLanguage: function () {
			const targetLanguage = $(this).data("language");
			localStorage.setItem("Language", targetLanguage);
			window.location.reload(true);
		},
		ScrollTo: function (target, selector = "html,body", delay = 1000) {
			var targetPosition = $(target).offset().top;
			$(selector).animate(
				{
					scrollTop: targetPosition,
				},
				delay
			);
		},
		AuthorityElementsInit: function (authorityElement) {
			console.log(
				"Yetki özelliği bulunan element sayısı: %c" + authorityElement.length + " adet!",
				"color: yellow; font-size:15px;"
			);
			if (iTech.lclStr.get("HRManagement.UserInfo") != null)
				var yetkiList = iTech.lclStr.get("HRManagement.UserInfo").yetkiNesneList;

			$.each(yetkiList, (k, v) => {
				$("[data-authority='" + v + "']").css("display", "block");
				$("[data-authority='" + v + "']").addClass("dBlock");
				//console.log("k. element -> ", $(v), "<->", $(v).data("authority"));
				$(v).show();
			});

			$.each(authorityElement, (k, v) => {
				$(v).not(".dBlock").remove();
			});
		},
	},
	User: {
		GetUser: $.parseJSON(localStorage.getItem("HRManagement.UserInfo")),
		GetToken: function () {
			return this.GetUser.token;
		},
		GetMenus: function ($roleId) {
			//const data = {
			//    roleId: $roleId
			//};

			/* TEST */
			var results = [];
			const roleIds = JSON.parse(localStorage.getItem("HRManagement.UserInfo")).roles;
			$.each(roleIds, function (k, v) {
				results.push(v.roleId);
			});
			const data = {
				roleId: results.join(","),
			};
			const menuListForBreadCrumb = iTech.Services.Ajax(FormMethod.Get, "Menus/byRoleId", data);

			const menuListForMenu = iTech.Services.Ajax(FormMethod.Get, "Menus/MenuInfobyRoleId", data);

			if (menuListForMenu.data.length > 0) {
				let menuString = iTech.User.Helpers.MenuNew(menuListForMenu);
				$("#js-nav-menu2").append(menuString);
				$("#nav_filter_input").on(
					"keyup",
					iTech.Helpers.Debounce(() => iTech.User.Helpers.FilterMenu())
				);
				iTech.User.Helpers.SetActivePage();

				$("#js-nav-menu2").navigation({
					accordion: true,
					animate: "easeOutExpo",
					speed: 200,
					closedSign: "<em class='fal fa-angle-down text-white'></em>",
					openedSign: "<em class='fal fa-angle-up text-white'></em>",
				});

				iTech.User.Helpers.MakeBreadCrumb(menuListForBreadCrumb);

				//if ($("#bc-list").length)
				//iTech.User.Helpers.MakeBreadCrumb("#bc-list", menuList);
			}
		},
		GetRolesToList: function ($roles, $currentRoleId, $roleList) {
			let li = "";
			for (let i = 0; i < $roles.length; i++) {
				let select = "";
				if ($currentRoleId === $roles[i].roleId) select = "selected";
				li += "<li class=" + select + ">" + _;
				li += "<a" + _;
				li += "data-roleId=" + $roles[i].roleId + _;
				li += "class = 'dropdown-item' onclick=iTech.User.SetActiveRole('" + $roles[i].roleId + "') >" + _;
				li += $roles[i].roleName;
				li += "</a>";
				li += "</li>";
				$roleList.push($roles[i].roleId);
			}
			$("#role-dropdown-menu").append(li);
		},
		SetActiveRole: function ($roleId) {
			const lclStorageUserObj = $.parseJSON(localStorage.getItem("HRManagement.UserInfo"));
			lclStorageUserObj.currentRoleId = $roleId;
			for (let i = 0; i < lclStorageUserObj.roles.length; i++) {
				if (lclStorageUserObj.roles[i].roleId === $roleId) {
					lclStorageUserObj.currentRoleName = lclStorageUserObj.roles[i].roleName;
				}
			}
			localStorage.setItem("HRManagement.UserInfo", JSON.stringify(lclStorageUserObj));
			const uId = JSON.parse(localStorage.getItem("HRManagement.UserInfo")).roles[0].userId;
			const rId = JSON.parse(localStorage.getItem("HRManagement.UserInfo")).currentRoleId;
			iTech.Services.Ajax(FormMethod.Put, "Users/" + uId + "/role/" + rId);
			iTech.User.OpenDashboard(null, lclStorageUserObj.currentRoleName);
		},
		Login: function () {
			const data = {
				Email: $("#email").val().trim(),
				Password: $("#password").val().trim(),
			};

			const result = iTech.Services.Ajax(FormMethod.Post, "Account/login", data, false);

			if (result.success) {
				iTech.ShowMessage("Güvenlik Kontrolü", "Giriş Başarılı.");
				iTech.User.OpenDashboard(result);
			} else {
				const e = result.message;
				//iTech.UI.ShowValidationMessages(e.status, e.responseJSON, e.responseText);
				if (e.status === 404) {
					iTech.ShowMessage("Hata", e.responseText, "error");
				} else if (e.status === 401) {
					iTech.ShowMessage("Hata", e.responseText, "error");
				}
			}
		},
		Logout: function () {
			iTech.Services.Ajax(FormMethod.Get, "Dashboard/CacheRemove/" + iTech.lclStr.get("HRManagement.UserInfo").personelTanimId);
			localStorage.removeItem("HRManagement.UserInfo");
			localStorage.removeItem("HRManagement.ExpirationMinutes");
			window.location.href = "/";
		},
		/**
		 * User tablosunda login butonuna tıklandıktan sonra
		 * Giriş sayfasında login butonuna tıklandıktan sonra
		 * @param {any} result , UserDto
		 * @param {any} $role , Kullanıcının Rolü
		 */
		OpenDashboard: function (result, $role = null) {
			if (result) {
				var lclStorageObj = {};
				lclStorageObj = {
					email: result.data.email,
					id: result.data.id,
					fullName: result.data.name + _ + result.data.surname,
					token: result.data.token,
					roles: result.data.userRoles,
					title: result.data.title,
					currentRoleId: result.data.currentRoleId,
					currentRoleName: result.data.currentRoleName,
					personelTanimId: result.data.personelTanimId,
					kurumTanimIdGorev: result.data.kurumTanimIdGorev,
					personelKurumSicilNo: result.data.personelSicilNo,
					sorumluBirimList: result.data.sorumluBirimList,
					yetkiNesneList: result.data.yetkiNesneList,
				};
				localStorage.setItem("HRManagement.UserInfo", JSON.stringify(lclStorageObj));
				localStorage.setItem("HRManagement.ExpirationMinutes", new Date().getTime() + result.data.expirationMinutes * 1000);
			}

			var currentRoleName = $.parseJSON(localStorage.getItem("HRManagement.UserInfo")).currentRoleName;

			if ($role !== null) {
				currentRoleName = $role;
			}

			const directory = iTech.User.RightWay(currentRoleName, $.parseJSON(localStorage.getItem("HRManagement.UserInfo")));

			window.location.href = directory;
		},
		RightWay: function ($role, lclStr) {
			$(".userInfoName").text(lclStr.fullName);
			$(".userInfoRole").text(lclStr.title);
			var route,
				infoText = "";
			if ($role === "Test Personeli") {
				$("#institutionListDiv").addClass("d-none");
				infoText = lclStr.currentCompanyName;
				route = "/Test/TestWindow";
			}
			//else if ($role === "Admin") {
			//    $("#institutionListDiv").addClass("d-none");
			//    infoText = "";
			//    route = "/Administration/Menu";
			//}
			else route = "/Home/Dashboard";

			$(".userInfoInstitute").text(infoText);
			return route;
		},
		Helpers: {
			MakeMenu: function (ul, menuList) {
				try {
					let subList = $.grep(menuList, (v) => v.parentId !== null);
					for (let index = 0; index < menuList.length; index++) {
						if (menuList[index].parentId === null) {
							let li = "<li class='addCursor' id='m" + menuList[index].id + "'" + _;
							if (iTech.Helpers.GetCurrentPage().substring(1) === menuList[index].url) {
								li += "class='active'" + _;
							}
							li += ">";
							//let li = $("<li id='m" + menuList[index].id+"'>")
							//.append("<a class='nav-link' href='"+ window.location.protocol+ "//" + window.location.host + "/" +  menuList[index].url + "'>" + menuList[index].name + " </a>")
							li +=
								"<a class='nav-link' href='" +
								window.location.protocol +
								"//" +
								window.location.host +
								"/" +
								menuList[index].url +
								"'>";
							li += "<i class='" + menuList[index].icon + "'></i>";
							li += "<span class='nav-link-text'>";
							//li += menuList[index].name;
							li += menuList[index].name;
							li += "</span></a>";
							$(ul).append(li);
						}
						for (let subIndex = 0; subIndex < subList.length; subIndex++) {
							if (menuList[index].id === subList[subIndex].parentId) {
								//let sul = $("<ul class='nav nav-treeview'>");
								//let li = $("<li id='s" + subList[subIndex].id + "'>")
								//.append("<a class='nav-link ' href='" + subList[subIndex].url + "'>" + subList[subIndex].name + " </a>");
								let subUl = "<ul id='s" + menuList[index].id + "' class='nav nav-treeview' > ";
								let li = "<li id='s" + subList[subIndex].id + "'" + _;
								if (subList[subIndex].url === iTech.Helpers.GetCurrentPage().substring(1)) {
									li += "class='active'";
								} // Home/Dashboard
								li += ">";

								li +=
									"<a class='nav-link' href='" +
									window.location.protocol +
									"//" +
									window.location.host +
									"/" +
									subList[subIndex].url +
									"'>";
								li += "<i class='" + subList[subIndex].icon + "'></i>";
								li += "<span class='nav-link-text'>";
								li += subList[subIndex].name;
								li += "</span></a>";
								li += "</li>";
								subUl += li + "</ul>";
								$("li#m" + menuList[index].id + _ + " > a").removeAttr("href");
								if ($("ul#s" + menuList[index].id).length) {
									$("ul#s" + menuList[index].id).append(li);
								} else {
									$("li#m" + menuList[index].id).append(subUl);
								}
							}
						}
					}
					$(ul + " li.active")
						.parent("ul")
						.css("display", "block");
				} catch (ex) {
					console.log("Menü Oluşturulurken Hata Meydana Geldi \n", ex);
				} finally {
					$(ul).navigation({
						accordion: true,
						animate: "easeOutExpo",
						speed: 200,
						closedSign: "<em class='fal fa-angle-down text-white'></em>",
						openedSign: "<em class='fal fa-angle-up text-white'></em>",
					});
				}
			},
			MakeBreadCrumb: function (menuList) {
				var menuList = menuList.data;
				const subsDiv = $("div[data-subsparent]");
				const checkMatch = subsDiv.attr("data-subsparent");
				const subsParent = $.grep(menuList, (n, i) => n.description === checkMatch);
				var subMenus;
				if (subsParent.length) {
					subMenus = $.grep(menuList, (n, i) => n.parentId === subsParent[0].id);
					$.each(subMenus, function (key, value) {
						let selector = "";
						if (iTech.Helpers.GetCurrentPage() === "/" + value.url) {
							selector = "active";
						}

						var href = "/" + value.url;
						if (href === "/null") {
							href = "#";
						}
						const aString = "<a class='dropdown-item " + selector + "' href='" + href + "' >" + value.description + "</a>";
						subsDiv.append(aString);
					});
				}
			},
			MenuNew: function (menuList, isSub = false) {
				try {
					const activePage = iTech.Helpers.GetCurrentPage(true).slice(1);
					var html = isSub && menuList.data.length > 0 ? '<ul style="display:%D_STATUS%;">' : ""; // Wrap with div if true
					for (item in menuList.data) {
						const mName = menuList.data[item].name;
						const pName = menuList.data[item].parentName;
						const filterTags = iTech.Helpers.Slugify(mName, pName);
						html += '<li class="addCursor">';
						const mUrl =
							menuList.data[item].url != null
								? window.location.protocol + "//" + window.location.host + "/" + menuList.data[item].url
								: "#";
						const mIcon = menuList.data[item].icon != null ? menuList.data[item].icon : "";
						if (isSub) {
							html +=
								'<a href="' +
								mUrl +
								'"  data-filter-tags="' +
								filterTags +
								'"><span class="nav-link-text ' +
								mIcon +
								'" >' +
								mName +
								"</span></a>";
						} else {
							let isAriaExpanded = activePage === menuList.data[item].url ? "true" : "false";
							html +=
								'<a href="' +
								mUrl +
								'" data-filter-tags="' +
								filterTags +
								'"><i class="' +
								mIcon +
								'"></i><span class="nav-link-text" >' +
								menuList.data[item].name +
								"</span></a>"; // Submenu found, but top level list item.
						}
						var tmpMenu = {
							data: menuList.data[item].subMenus,
						};
						html += iTech.User.Helpers.MenuNew(tmpMenu, true);

						html += "</li>";
					}
					html += isSub && menuList.data.length > 0 ? "</ul>" : "";

					/*
                    description: "Yönetim Paneli"
                    icon: "fas fa-cogs"
                    id: 1
                    name: "Yönetim Paneli"
                    order: 0
                    param: null
                    parent: null
                    parentId: null
                    parentName: null
                    subMenus:[];
                    */
				} catch (ex) {
					console.log("Menü Oluşturulurken Hata Meydana Geldi \n", ex);
				} finally {
					return html;
				}
			},
			SetActivePage: function () {
				const fullPageUrl = window.location.protocol + "//" + window.location.host + iTech.Helpers.GetCurrentPage(true);
				let aHrefs = $("#js-nav-menu2").find("a");
				$.each(aHrefs, (ind, el) => {
					const ele = $(el).eq(0);
					let elementHref = ele.attr("href");
					if (elementHref === fullPageUrl) {
						let parentULs = ele.parents("ul");
						parentULs.css("display", "block");

						let parentLi = ele.parents("li:first");
						parentLi.addClass("active");
					}
				});
			},
			FilterMenu: function (e) {
				var inputValue = iTech.Helpers.Slugify($("#nav_filter_input").val(), null);
				var aHrefs = $("ul#js-nav-menu2 li a");
				if (inputValue.length > 2)
					$.each(aHrefs, function (index, htmlEl) {
						var dataFilterTag = $(htmlEl).data("filter-tags");
						if (!dataFilterTag.includes(inputValue)) {
							$(htmlEl).parent("li").hide();
						} else {
							$.each($(htmlEl).parents("li"), (_index, _htmlEl) => {
								$(_htmlEl).show();
								$(_htmlEl).parents("ul").css("display", "block");
							});
						}
					});
				else {
					$.each($("ul#js-nav-menu2 ul"), (_index, _htmlEl) => {
						_htmlEl.style.removeProperty("display");
					});

					$.each($("ul#js-nav-menu2 li"), (index, htmlEl) => {
						$(htmlEl).show();
					});
					$("ul#js-nav-menu2 li .active").parents("ul").css("display", "block");
				}
			},
		},
	},
	ShowMessage: function ($header, $message, $type = "success", $positionClass = "toast-bottom-right") {
		toastr.options = {
			closeButton: false,
			debug: false,
			newestOnTop: false,
			progressBar: false,
			positionClass: $positionClass,
			preventDuplicates: false,
			onclick: null,
			showDuration: 300,
			hideDuration: 1000,
			timeOut: 5000,
			extendedTimeOut: 1000,
			showEasing: "swing",
			hideEasing: "linear",
			showMethod: "fadeIn",
			hideMethod: "fadeOut",
		};
		toastr[$type]($message, $header);
	},
	DataTable: {
		Load: {
			AjaxSourced: function (
				$targetTable,
				$reqUrl,
				$type = FormMethod.Post,
				$pageLength = 10,
				filterData = {},
				$left = 0,
				$right = 1
			) {
				const opts = $($targetTable).get(0).dataset;
				const isResponsive = typeof opts.responsive == typeof undefined ? true : opts.responsive;
				const isSelect = typeof opts.select == typeof undefined ? false : opts.select;
				const isVisible = typeof opts.visiblearray == typeof undefined ? true : false;
				const filterInfo = typeof opts.filter == typeof undefined ? false : opts.filter;
				const nosearch = typeof opts.domNosearch == typeof undefined ? false : opts.domNosearch;
				$pageLength =
					opts.pagination == "false" && typeof opts.pagination != typeof undefined
						? 2147483647
						: $pageLength == "All"
						? 2147483647
						: $pageLength;
				try {
					var table = $($targetTable).DataTable({
						destroy: true,
						responsive: isResponsive,
						pageLength: $pageLength,
						lengthMenu: [
							[10, 25, 50, 75, 100, 2147483647],
							[10, 25, 50, 75, 100, "All"],
						],
						processing: true,
						serverSide: true,
						filter: true,
						orderMulti: true,
						deferRender: true,
						select: isSelect,
						dom: iTech.DataTable.Helpers.GetDomString(nosearch),
						// language: { url: "//" + appFolder.localization + "dataTable/tr.json" },
						ajax: {
							url: iTech.Defaults.ApiBaseUrl + $reqUrl,
							type: $type,
							async: false,
							datatype: "json",
							//contentType: "application/json",
							data: filterData,
							//dataSrc: function (json) {
							//    if (filterInfo) {
							//        // Tablo çizilmeden önce eğer gelmesini istemediğimiz datalar varsa bunları buradan filtreleyebiliriz.
							//        var filterArray = filterInfo.split(":")[0];
							//        var filterId = filterInfo.split(":")[1];
							//        json.data = json.data.filter(x => filterArray.includes(x[filterId]));
							//    }
							//    return json.data;
							//},
							beforeSend: function (jqXhr, settings) {
								// jqXhr.setRequestHeader("Authorization", "Bearer " + iTech.User.GetToken());
							},
							error: function (xhr, error, code) {
								console.log(error);
								//throw xhr;
							},
						},
						scrollX: !isResponsive,
						scrollCollapse: false,
						fixedColumns: {
							left: $left,
							right: $right,
						},
						buttons: iTech.DataTable.Helpers.GetTblTopButtons($targetTable, opts.topbuttons),
						columns: iTech.DataTable.Helpers.GetTblColumns($targetTable), // https://datatables.net/reference/option/columns
						//createdRow: function (row, data, index) {
						//    if (data[3] > 11.7) {
						//        $(row).find('td:eq(3)').css('color', 'red');
						//    }
						//    if (data[2].toUpperCase() == 'EE') {
						//        $(row).find('td:eq(2)').css('color', 'blue');
						//    }
						//},
						/*
						 * "Column Defs" => örnek <table> içerisinde visiblearray adındaki attribute içindeki array'e bakar  (e.g. data-visiblearray=[0,1]).
						 * Bu array buraya string olarak geldiği için JSON.parse ederiz.
						 * Kullanılan yer otomatikterfi.js   attr("data-visibleArray",      bu sayfada attrbutes ekliyorum.
						 */
						columnDefs: [
							{
								visible: isVisible,
								targets: !isVisible ? JSON.parse("[" + opts.visiblearray + "]") : [],
							},
						],
						rowCallback: (row, data) => iTech.DataTable.Helpers.GetTblColActButtons(row, data, $targetTable), // https://datatables.net/reference/option/rowCallback
					});
				} catch (e) {
					console.log(e);
					iTech.UI.ShowValidationMessages(e.status, e.responseJSON, e.responseText);
				}
				return table;
			},
			WithoutColumns2: function ($targetTable, $colTable, dtReqUrl, requestData, addIdField = false) {
				try {
					var thList = `<thead><tr role="row">`;

					const selectedItems = $($colTable).DataTable().rows(".selected").data();

					$.each(selectedItems, (i, obj) => {
						let veriTipAd = "";
						if (obj["veriTip"] == 20) veriTipAd = " data-type='date'";
						if (obj["veriTip"] == 30) veriTipAd = " data-type='bool'";
						thList +=
							"<th data-orderable='true' " +
							veriTipAd +
							"  data-col='" +
							obj["normalizeAd"] +
							"'>" +
							obj["degerMetin"] +
							"</th>";
					});

					thList += "</tr></thead>";
					$($targetTable).append(thList);

					return iTech.DataTable.Load.AjaxSourced($targetTable, dtReqUrl, FormMethod.Post, "All", requestData, 0, 0);
				} catch (e) {
					iTech.ShowMessage("İşlem Sonucu", "Tabloda Veri Mevcut Değildir!", "warning");
				}
				return false;
			},
			WithoutColumns: function ($targetTable, colReqUrl, dtReqUrl, addIdField = false) {
				const opts = $($targetTable).get(0).dataset;
				const isResponsive = typeof opts.responsive == typeof undefined ? true : opts.responsive;
				try {
					const colResult = iTech.Services.Ajax("POST", colReqUrl);
					if (colResult.success) {
						if (colResult.data.length > 0) {
							var thList = `<thead>
                                    <tr role="row">`;
							if (addIdField) thList += `<th data-col="Id">Id</th>`;
							$.each(colResult.data, (i, obj) => {
								thList += `<th data-col="${obj.ad}">${obj.etiket}</th>`;
							});
							thList += `<th data-col="actions" data-act="edit.delete">İşlemler</th>
                                   </tr>
                                </thead>`;
							$($targetTable).append(thList);
						}
					}

					var table = iTech.DataTable.Load.AjaxSourced($targetTable, dtReqUrl);
				} catch (e) {
					iTech.ShowMessage("İşlem Sonucu", "Tabloda Veri Mevcut Değildir!", "warning");
				}
				return table;
			},
			DataSourced: (tableId, data = {}) => {
				const YVal = typeof $(tableId).data("scrolly") !== typeof undefined ? $(tableId).data("scrolly") : false;
				const PVal = YVal ? false : true;
				const headings = $(tableId).find("thead th");
				const hasAlreadyTBody = $(tableId).find("tbody").length;
				if (hasAlreadyTBody) $(tableId).find("tbody").remove();

				if (iTech.DataTable.IsDataTable(tableId)) $(tableId).DataTable().destroy();

				var domTemplate = `<'row mb-3'
                        <'col-xl-2 col-lg-3 col-md-4 col-sm-12 d-flex align-items-center justify-content-start'f>
                        <'offset-8 col-xl-2 col-lg-3 col-md-2 col-sm-12 d-flex align-items-center justify-content-end'l>
                    >
                    <'row'
                        <'col-sm-12'tr>
                    >
                    <'row'
                        <'col-sm-12 col-md-5'i>
                        <'col-sm-12 col-md-7'p>
                    >`;
				if (YVal) domTemplate = `<'row'<'col-sm-12'tr>>`;

				var tbody = `<tbody>`;
				$.each(data, (ind, obj) => {
					tbody += `<tr>`;
					$.each(headings, (i, htmlEl) => {
						const colData = obj[$(htmlEl).data("col")];
						tbody += `<td>${colData}</td>`;
					});
					tbody += `</tr>`;
				});
				tbody += `</tbody>`;
				$(tableId).append(tbody);

				return $(tableId).DataTable({
					scrollY: YVal,
					paging: PVal,
					dom: domTemplate,
				});
			},
			WithData: function ($targetTable, inData = [], $pageLength = 10) {
				const opts = $($targetTable).get(0).dataset;
				const isResponsive = typeof opts.responsive == typeof undefined ? true : opts.responsive;

				$pageLength = opts.pagination == "false" && typeof opts.pagination != typeof undefined ? 2147483647 : $pageLength;
				//opts.select = (typeof opts.select == typeof undefined) ?  : opts.responsive;
				try {
					var table = $($targetTable).DataTable({
						destroy: true,
						paging: false,
						//pageLength: $pageLength,
						//lengthMenu: [[10, 25, 50, 75, 100], [10, 25, 50, 75, 100]],
						dom: iTech.DataTable.Helpers.GetDomString(),
						// language: { url: "//" + appFolder.localization + "dataTable/tr.json" },
						data: inData,
						scrollX: !isResponsive,
						scrollY: "200px",
						scrollCollapse: true,
						//buttons: iTech.DataTable.Helpers.GetTblTopButtons($targetTable, opts.topbuttons),
						columns: iTech.DataTable.Helpers.GetTblColumns($targetTable), // https://datatables.net/reference/option/columns
						//rowCallback: (row, data) => iTech.DataTable.Helpers.GetTblColActButtons(row, data, $targetTable) // https://datatables.net/reference/option/rowCallback
					});
				} catch (e) {
					iTech.UI.ShowValidationMessages(e.status, e.responseJSON, e.responseText);
				}
				return table;
			},
			Dynamic: function ($targetTable, $reqUrl, $type = FormMethod.Post, $pageLength = 10, data = {}) {
				const opts = $($targetTable).get(0).dataset;
				const isResponsive = typeof opts.responsive == typeof undefined ? true : opts.responsive;

				$pageLength = opts.pagination == "false" && typeof opts.pagination != typeof undefined ? 2147483647 : $pageLength;
				//opts.select = (typeof opts.select == typeof undefined) ?  : opts.responsive;
				try {
					var table = $($targetTable).DataTable({
						destroy: true,
						responsive: isResponsive,
						pageLength: $pageLength,
						lengthMenu: [
							[10, 25, 50, 75, 100],
							[10, 25, 50, 75, 100],
						],
						processing: true,
						serverSide: true,
						filter: true,
						ordering: false,
						deferRender: true,
						dom: iTech.DataTable.Helpers.GetDomString(),
						language: { url: "//" + appFolder.localization + "dataTable/tr.json" },
						ajax: {
							url: iTech.Defaults.ApiBaseUrl + $reqUrl,
							type: $type,
							async: false,
							datatype: "json",
							data: data,
							beforeSend: function (jqXhr, settings) {
								jqXhr.setRequestHeader("Authorization", "Bearer " + iTech.User.GetToken());
							},
							error: function (xhr, error, code) {
								console.log(error);
								//throw xhr;
							},
						},
						buttons: iTech.DataTable.Helpers.DynamicTopButtons($targetTable, opts.topbuttons),
						columns: iTech.DataTable.Helpers.DynamicColumns($targetTable),
						rowCallback: (row, data) => iTech.DataTable.Helpers.DynamicRowCallback(row, data, $targetTable),
						//columnDefs: [
						//    {targets: [1], visible: true }  // istediğimiz kolunu visieble yapabiliriz.
						//],
					});
				} catch (e) {
					iTech.UI.ShowValidationMessages(e.status, e.responseJSON, e.responseText);
				}
				return table;
			},
			TableCreate: function (table, data, tableHead = false) {
				let cols = [];
				let filterCol = [];
				$(table + _ + "thead > tr > th").each(function (k, v) {
					var itemCol = { dCol: $(this).get(0).dataset.col, dType: $(this).get(0).dataset.type };
					filterCol.push(itemCol.dCol);
					cols.push(itemCol);
				});

				let tableDatas = [];
				$.each(data, function (objK, objV) {
					var entryItems = Object.entries(objV);
					var pushItem = Object.fromEntries(entryItems.filter(([key, value]) => filterCol.includes(key)));
					tableDatas.push(pushItem);
				});

				let tBody = "";
				$.each(tableDatas, function (k, v) {
					var boolAdd = true;
					let tR = "<tr data-dynamic='true'>";
					$.each(cols, function (altK, findColItem) {
						var objItem = tableDatas[k][findColItem.dCol];

						if (findColItem.dType == "number") {
							boolAdd = objItem > 0;
							objItem = iTech.Helpers.formatMoney(objItem);
							tR += `<td class='text-right'><small>${objItem}<small></td>`;
						} else if (findColItem.dType == "date") {
							objItem = moment.utc(objItem).format("DD.MM.YYYY");
							tR += `<td class='text-center'><small>${objItem}<small></td>`;
						} else tR += `<td><label class="form-label">${objItem}</label></td>`;
					});
					tR += "</tr>";
					if (boolAdd) tBody += tR;
				});

				$(table + " > tbody").append(tBody);
				if (!tableHead) $(table + " thead").hide();
			},
		},
		Refresh: {
			// Tables Kalacak, for each hepsinin işini görüyor.
			Tables: function (tableNames) {
				const tables = tableNames.split(",");
				return $.each(tables, (i, e) => {
					$(e).DataTable().ajax.reload(null, false);
				});
			},
		},
		FindInDataSet: function (table, $dtSetKey, $targetKey) {
			const tableDataSet = $("#" + table)
				.DataTable()
				.rows()
				.data();
			const rowData = $.grep(tableDataSet, (n) => n[$dtSetKey] === $targetKey)[0];
			return rowData;
		},
		Helpers: {
			CreateTblColActButtons: function ($actionList, $dataId = null) {
				$dataId = $dataId != null ? "  data-id='" + $dataId + "'" : "";
				let htmlString = "";
				htmlString += "<div class='btn-group align-items-center'>";
				$.each($actionList, function (index, element) {
					switch (element) {
						case "edit":
							htmlString +=
								"<button type='button' data-role='edit' class='btn btn-warning btn-xs' " +
								$dataId +
								" title='Düzenle'> <i class='text-white fas fa-edit'> </i></button>";
							break;
						case "delete":
							htmlString +=
								"<button type='button' data-role='delete' class='btn btn-danger btn-xs'" +
								$dataId +
								" title='Sil' > <i class='fas fa-trash'> </i></button>";
							break;
						case "choose":
							htmlString +=
								"<button type='button' data-role='choose' class='btn btn-success btn-xs'" +
								$dataId +
								" title='Seç' > <i class='fas fa-plus'> </i></button>";
							break;
						case "bring":
							htmlString +=
								"<button type='button' data-role='bring' class='btn btn-success btn-xs' " +
								$dataId +
								" title='Getir' > <i class='fas fa-arrow-right'> </i></button>";
							break;
						case "loginAs":
							htmlString +=
								"<button type='button' data-role='loginAs' class='btn btn-primary btn-xs actionBtn' title='Giriş Yap'> <i class='fas fa-sign-in-alt'> </i> </button>";
							break;
						case "detail":
							htmlString +=
								"<button  type='button' data-role='detail' class='btn btn-primary btn-xs'" +
								$dataId +
								" title='Detaylar'> <i class='fa fa-search'> </i> </button>";
							break;
						case "settings":
							htmlString +=
								"<button type='button' data-role='settings' title='Ayarlar'" +
								$dataId +
								" class='btn btn-primary btn-xs' > <i class='fas fa-cogs'></i> </button>";
							break;
						case "contact":
							htmlString +=
								"<button type='button' data-role='contact' title='Eğitmenler'" +
								$dataId +
								" class='btn btn-primary btn-xs' > <i class='fas fa-chalkboard-teacher'></i> </button>";
							break;
						case "list":
							htmlString +=
								"<button type='button' data-role='list' title='Katılımcılar'" +
								$dataId +
								" class='btn btn-primary btn-xs' > <i class='fa fa-list'></i> </button>";
							break;
						case "file":
							htmlString +=
								"<button type='button' data-role='file' title='Dosyalar'" +
								$dataId +
								" class='btn btn-primary btn-xs' > <i class='fas fa-file'></i> </button>";
							break;
						case "survey":
							htmlString +=
								"<button type='button' data-role='survey' title='Anket'" +
								$dataId +
								" class='btn btn-primary btn-xs' > <i class='fas fa-poll'></i> </button>";
							break;
						case "approve":
							htmlString +=
								"<button type='button' data-role='approve' title='Onayla'" +
								$dataId +
								" class='btn btn-primary btn-xs' > <i class='fas fa-check'></i> </button>";
							break;
						case "checkbox":
							htmlString += "<input type='checkbox' name='name' style='width:18px;height:18px;'/>";
							break;
						case "switch":
							htmlString += "<div class='custom-control custom-switch'>";
							htmlString += "<input type='checkbox' data-type='switcher' class='custom-control-input'>";
							htmlString += "<label class='custom-control-label'></label>";
							htmlString += "</div>";
						default:
							break;
					}
				});
				htmlString += "</div>";
				return htmlString;
			},
			CreateTblRuleButtons: function (rulename, row) {
				let htmlString = "<div class='btn-group align-items-center'>";
				switch (rulename) {
					case "IzinKidemModal":
						const isDisplay = row.kidemeGoreHesaplanir ? "" : "d-none";
						htmlString += `<button type='button' data-role='rule' title='Rule' data-id="${row.id}" data-izinTurTanimId="${row.izinTurTanimId}" class='btn btn-primary btn-xs ${isDisplay}'> <i class='fas fa-list'></i> </button>`;
						//htmlString += "<button type='button' onclick='IzinIstihdamSekilPage.Helpers.KidemDetayModalAc(" + data.id + "," + data.izinTurTanimId + ");' data-role='null' class='btn btn-warning btn-xs' title='Kıdem Detayları'> <i class='text-white fas fa-tasks'> </i></button>";
						return htmlString;
						break;
					default:
						return "";
				}
				return (htmlString += "</div>");
			},
			GetTblTopButtons: function (tblName, opts) {
				const jqElement = $(tblName);

				let dataTitle = jqElement.attr("data-title") ? jqElement.attr("data-title") : false;

				let fileName = jqElement.attr("data-filename") ? jqElement.attr("data-filename") : false;

				let messagetop = jqElement.attr("data-messagetop") ? jqElement.attr("data-messagetop") : false;

				let landscape = null;
				if ($(window).width() > 4) {
					landscape = "landscape";
				}

				const buttonList = [];
				if (opts !== undefined) {
					opts = opts.split(".");
					$.each(opts, function (index, element) {
						switch (element) {
							case "xls":
								buttonList.push({
									extend: "excelHtml5",
									text: "Excel",
									title: dataTitle ? dataTitle : null,
									filename: fileName ? fileName : "Excel Rapor",
									messageTop: messagetop ? messagetop : null,
									titleAttr: "Generate Excel",
									className: "btn-outline-success btn-sm mr-1",
									exportOptions: {
										columns: iTech.DataTable.Helpers.ExportOptions.GetColumns(tblName),
									},
								});
								break;
							case "pdf":
								buttonList.push({
									extend: "pdfHtml5",
									text: "PDF",
									title: dataTitle ? dataTitle : null,
									filename: fileName ? fileName : "Excel Rapor",
									messageTop: messagetop ? messagetop : null,
									titleAttr: "Generate PDF",
									className: "btn-outline-danger btn-sm mr-1",
									orientation: landscape,
									exportOptions: {
										columns: iTech.DataTable.Helpers.ExportOptions.GetColumns(tblName),
									},
									customize: function (doc) {
										//doc.content[1].table.widths = Array(doc.content[1].table.body[0].length + 1).join('*').split('');
									},
								});
								break;
							case "add":
								buttonList.push({
									text: '<i class="fal fa-plus mr-1"></i> Ekle',
									attr: {
										name: "create",
									},
									className: "btn-primary btn-sm mr-1",
								});
								break;
							case "print":
								buttonList.push({
									text: '<i class="fal fa-print mr-1"></i> Yazdır',
									attr: {
										name: "print",
									},
									className: "btn-success btn-sm mr-1",
								});
								break;
							case "remove":
								buttonList.push({
									text: '<i class="fas fa-times mr-1"></i> Çıkar',
									attr: {
										name: "remove",
									},
									className: "btn-danger btn-sm mr-1",
								});
								break;
							case "colvis":
								buttonList.push({
									extend: "colvis",
									text: '<i class="fal fa-columns mr-1"></i> Tablo Kolon Listesi',
									titleAttr: "Col visibility",
									className: "btn-outline-default",
								});
								break;
							case "topluKadroSil":
								buttonList.push({
									text: '<i class="fas fa-times mr-1"></i> Kadro Sil',
									attr: {
										name: "kadroSil",
									},
									className: "btn-danger btn-sm mr-1",
								});
								break;
							case "donemOlustur":
								buttonList.push({
									text: '<i class="fas fa-sync mr-1"></i> Dönem Oluştur',
									attr: {
										name: "donemOlustur",
									},
									className: "btn-success btn-sm mr-1",
								});
								break;
							case "kaydet":
								buttonList.push({
									text: '<i class="fas fa-sync mr-1"></i> Kaydet',
									attr: {
										name: "kaydet",
									},
									className: "btn-success btn-sm mr-1",
								});
								break;
						}
					});
				}
				return buttonList;
			},
			GetTblColumns: function ($table) {
				const cols = [];
				const startDiv = `<div class='text-ALIGN'>`;
				const endDiv = `</div>`;

				$($table + _ + "thead > tr > th").each(function (k, v) {
					const obj = {};
					const tAlign = $(this).data("align") ?? "left";
					if ($(this).data("col") === "actions") {
						// Eğer data-col="actions" tanımlı ve data-act tanımlı değil ise
						if ($(this).data("act") === undefined) {
							$(this).remove();
							return;
						}
						const actionList = $(this).data("act").split(".");

						const hasRule = actionList.includes("rule");

						const tempRow = $($table).find("thead th:first");
						if (tempRow.data("col") == "selection") obj["data"] = $($table).find("thead th:eq(1)").data("col");
						else obj["data"] = tempRow.data("col");

						obj["render"] = function (data, type, row) {
							let render = "";
							if (hasRule) {
								const ruleName = $(v).data("rule");
								render += iTech.DataTable.Helpers.CreateTblRuleButtons(ruleName, row);
							}
							render += iTech.DataTable.Helpers.CreateTblColActButtons(actionList, row.id);
							return render;
						};
						obj["width"] = "1px";
					} else if ($(this).data("type") == "date") {
						obj["width"] = "auto";
						obj["data"] = $(this).data("col");
						obj["render"] = function (data, type, row) {
							if (data !== null) {
								let rString = startDiv.replace("ALIGN", tAlign);
								rString += moment.utc(data).format("DD.MM.YYYY") + endDiv;
								return rString;
							}
							return data;
						};
					} else if ($(this).data("type") == "tdate") {
						obj["width"] = "auto";
						obj["data"] = $(this).data("col");
						obj["render"] = function (data, type, row) {
							if (data !== null && data != "01.01.0001") {
								let rString = startDiv.replace("ALIGN", tAlign);
								rString += data + endDiv;
								return rString;
							} else return "";
						};
					} else if ($(this).data("type") == "image") {
						obj["data"] = $(this).data("col");
						var el = $(this);
						obj["render"] = function (data, type, row) {
							let rString = "";
							rString += `<img src='${data}' width='45' height='45' alt='profilResmi' id='imageHolder' />`;
							rString += endDiv;
							return rString;
						};
						obj["width"] = "1px";
					} else if ($(this).data("col") == "selection") {
						obj["width"] = "1px";
						obj["orderable"] = false;
						obj["defaultContent"] = "";
						obj["className"] = "select-checkbox";
						obj["render"] = function (data, type, row) {
							if (Object.keys(row).includes("degerBilgi")) {
								if (row.degerBilgi === "selected") {
									var el = $($table + _ + "tbody > tr > td div");
									$.each(el, (k, v) => {
										if ($(v).text() == row.degerMetin) {
											$(v).closest("tr").addClass("selected");
										}
									});
								}
							}
						};
					} else if ($(this).data("type") == "bool") {
						obj["data"] = $(this).data("col");
						obj["render"] = function (data, type, row) {
							let rString = startDiv.replace("ALIGN", tAlign);
							rString += data ? "<i class='fa fa-check text-success'></i>" : "<i class='fa fa-times text-danger'></i>";
							rString += endDiv;
							return rString;
						};
						obj["width"] = "auto";
					} else if ($(this).data("short")) {
						obj["data"] = $(this).data("col");
						obj["render"] = function (data, type, row) {
							return "<div style='white-space: normal;' >" + data + "</div>";
						};
						obj["width"] = '"' + $(this).data("short") + 'px"';
					} else if ($(this).data("col") == "dummyData") {
						obj["width"] = "auto";
						/*  obj["data"] = $(this).data("col");*/

						//obj["defaultContent"] = "test";

						function getRandomText() {
							var text = "";
							var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

							for (var i = 0; i < 5; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
							return text;
						}

						const ddType = $(this).data("val");
						const dummyDatas = {
							date: new Date().toDateString(),
							text: getRandomText(),
							number: Math.floor(Math.random() * 100 + 1),
							city: "Ankara",
							author: "İş Teknoloji",
						};

						obj["defaultContent"] = dummyDatas[ddType];
					} else if (typeof $(this).data("href") != typeof undefined) {
						obj["data"] = $(this).data("col");
						var el = $(this);
						obj["render"] = function (data, type, row) {
							let rString = "";
							var href = el.data("href"); // OzetBilgi
							var params = el.data("hparams") ?? ""; // undefined degilse değerini al, undefined ise '' yap.
							if (params.length) {
								var paramArr = params.split(",");
								$.each(paramArr, (i, e) => {
									i > 0 ? (href += "&") : (href += "?");
									var eArr = e.split("=");
									href += eArr[0] + "=";
									if (eArr[1].indexOf("%") > -1) {
										href += row[eArr[1].replace("%", "")];
									} else {
										href += eArr[1];
									}
								});
							}
							if (data) rString += `<a href='${row.url}' target='_blank' class='text-primary text-underline' >${data}</a>`;
							rString += endDiv;
							return rString;
						};
						obj["width"] = "auto";
					} else if (typeof $(this).data("link") != typeof undefined) {
						obj["data"] = $(this).data("col");
						var el = $(this);
						obj["render"] = function (data, type, row) {
							let rString = "",
								sendData = {};
							var params = el.data("link") ?? ""; // undefined degilse değerini al, undefined ise '' yap.
							if (params.length) {
								var paramArr = params.split(",");
								$.each(paramArr, (i, e) => {
									var eArr = e.split("=");
									if (eArr[1].indexOf("%") > -1) {
										// istihdamSekliId
										sendData[eArr[0]] = row[eArr[1].replace("%", "")];
									} else {
										sendData[eArr[0]] = eArr[1];
									}
								});
							}
							var json = JSON.stringify(sendData);
							if (data)
								rString += `<a onclick=KPOPage.Helpers.OzetOpenModel('${json}') class='text-info' style="text-decoration: underline; cursor: pointer;">${data}</a>`;
							rString += endDiv;
							return rString;
						};
						obj["width"] = "auto";
					} else if (typeof $(this).data("color") != typeof undefined) {
						//#region Otomatik Terfi Tablosu için geçerli kurallar
						if ($(this).data("color") === "otomatikterfi") {
							obj["data"] = $(this).data("col");
							obj["render"] = (data, type, row, meta) => BusinessRules.OtomatikTerfi(data, type, row, meta, tAlign);
						}

						if ($(this).data("color") === "personelterfi") {
							obj["data"] = $(this).data("col");
							obj["render"] = (data, type, row, meta) => BusinessRules.TerfiBilgiKarti(data, type, row, meta, tAlign);
						}
						//#endregion
					} else {
						obj["data"] = $(this).data("col");
						obj["render"] = function (data, type, row) {
							if (data == null) {
								data = "";
							}

							let rString = startDiv.replace("ALIGN", tAlign);
							rString += data + endDiv;
							return rString;
						};
					}
					obj["orderable"] = typeof $(this).data("orderable") == typeof undefined ? false : $(this).data("orderable");

					cols.push(obj);
				});
				return cols;
			},
			GetTblRow: function (row, data, dataIndex) {
				const cols = [];
				const startDiv = `<div class='text-ALIGN'>`;
				const endDiv = `</div>`;
				$($table + _ + "thead > tr > th").each(function (k, v) {
					const obj = {};
					const tAlign = $(this).data("align") ?? "left";
					if ($(this).data("col") === "actions") {
						// Eğer data-col="actions" tanımlı ve data-act tanımlı değil ise
						if ($(this).data("act") === undefined) {
							$(this).remove();
							return;
						}
						const hasRule = $.inArray("rule", actionList);
						if (hasRule) {
							const tempRow = $($table).find("thead th:first");
							obj["data"] = tempRow.data("col");
							obj["render"] = function (data, type, row) {
								return iTech.DataTable.Helpers.CreateTblColActButtons(actionList, row.id);
								iTech.DataTable.Helpers.CreateTblRuleButtons(ruleName, row);
								test += iTech.DataTable.Helpers.CreateTblColActButtons(actionList, row.id);
							};
						} else {
							obj["render"] = iTech.DataTable.Helpers.CreateTblColActButtons(actionList);
						}

						obj["width"] = "1px";
					}
					obj["orderable"] = typeof $(this).data("orderable") == typeof undefined ? false : $(this).data("orderable");

					cols.push(obj);
				});
				return cols;
			},
			GetTblColActButtons: function (row, data, tblName) {
				tblName = tblName.replace("#", "");
				const dId = data.id ?? data.Id;
				row.dataset.id = dId;
				const btnObjects = $(row.childNodes).last().find("button,input");
				$.each(btnObjects, function (key, htmlEl) {
					if ($(htmlEl).is("input")) {
						if ($(htmlEl).data("type") === "switcher") {
							$(htmlEl).attr("id", tblName + "Switcher" + dId);
							$(htmlEl).prop("checked", data.isActive);
							$(htmlEl)
								.next()
								.attr("for", tblName + "Switcher" + dId);
						}
					}
					$(htmlEl).data("id", dId);
				});
				return btnObjects;
			},
			ExportOptions: {
				GetColumns: function (tblName) {
					const cols = [];
					$(tblName + _ + "thead th").each(function (index, htmlEl) {
						if ($(this).hasAttr("data-export")) {
							if ($(this).data("export") === true && typeof $(this).data("export") != typeof undefined) {
								cols.push(index);
							}
						} else cols.push(index);
					});
					return cols;
				},
				Styles: {
					Excel: function () {},
				},
			},
			GetDomString: (noSearch = true) => {
				// sonrasında customize edilebilir bir şekilde yazabilirsin (Bertan);
				// fBlip
				var domTemplate = "";
				if (!noSearch) {
					domTemplate = `<'row mb-3'
                        <'col-xl-2 col-lg-3 col-md-4 col-sm-12 d-flex align-items-center justify-content-start' f>
                        <'col-xl-8 col-lg-6 col-md-6 col-sm-12 d-flex align-items-center justify-content-center'B>
                        <'col-xl-2 col-lg-3 col-md-2 col-sm-12 d-flex align-items-center justify-content-end'l>
                    >
                    <'row'
                        <'col-sm-12'tr>
                    >
                    <'row'
                        <'col-sm-12 col-md-5'i>
                        <'col-sm-12 col-md-7'p>
                    >`;
				} else {
					domTemplate = `<'row mb-3'
                        <'col-xl-2 col-lg-3 col-md-4 col-sm-12 d-flex align-items-center justify-content-start'>
                        <'col-xl-8 col-lg-6 col-md-6 col-sm-12 d-flex align-items-center justify-content-center'B>
                        <'col-xl-2 col-lg-3 col-md-2 col-sm-12 d-flex align-items-center justify-content-end'l>
                    >
                    <'row'
                        <'col-sm-12'tr>
                    >
                    <'row'
                        <'col-sm-12 col-md-5'i>
                        <'col-sm-12 col-md-7'p>
                    >`;
				}
				/*
                 Üst Tablo => Personel Datası gelecek (bütünhepsini getir);
                 Üstten checkbox ile seçip aşağıdaki tabloya ekleyecek.
             
                 Alt Tablo => 
                 
                 altında input olacak. orada tarih vs girip kaydedince, o tablo erilerinin hepsini endpointe göndericez.
                 
                 */

				//chars = chars.toUpperCase();
				//for (let i = 0; i < chars.length; i++) {
				//    if (chars[i] !== "B")
				//        domTemplate = domTemplate.replace("%" + chars[i], chars[i].toLowerCase());
				//}
				return domTemplate;
			},
			GetGroupedColumn: (tableId) => {
				var targetData = $(tableId).find("thead > tr:first").attr("group-by");
				return typeof targetData != typeof undefined ? { dataSrc: targetData } : false;
			},
			DynamicTopButtons: function (tblName, opts) {
				const buttonList = [];
				if (opts !== undefined) {
					opts = opts.split(".");
					$.each(opts, function (index, element) {
						switch (element) {
							case "Save":
								buttonList.push({
									text: "Kaydet",
									attr: {
										name: "SaveTable",
									},
									className: "btn-success btn-sm mr-1",
								});
								break;
						}
					});
				}
				return buttonList;
			},
			DynamicColumns: function ($table) {
				const cols = [];
				const startDiv = `<div class='text-ALIGN'>`;
				const endDiv = `</div>`;

				$($table + _ + "thead > tr > th").each(function (k, v) {
					const obj = {};
					const tAlign = $(this).data("align") ?? "left";
					const isReadOnly = $(this).hasAttr("readonly");

					if ($(this).data("type") == "text") {
						obj["data"] = $(this).data("col");
						obj["render"] = function (data, type, row) {
							if (data !== null) {
								let rString = `<input type="text" name="${
									obj.data
								}" data-type="text"  class="form-control form-control-xs table-input" style="color: 'black';" value="${data}"  ${
									isReadOnly ? "disabled" : ""
								}/>`;
								return rString;
							}
						};
						obj["width"] = "auto";
					} else if ($(this).data("type") == "label") {
						obj["data"] = $(this).data("col");
						obj["render"] = function (data, type, row) {
							if (data !== null) {
								let rString = `<span>${data}</span>`;
								return rString;
							}
						};
						obj["width"] = "auto";
					} else if ($(this).data("type") == "select") {
						obj["data"] = $(this).data("col");
						var datamethod = $(this).data("method");
						var dataParam = $(this).data("param");
						obj["render"] = function (data, type, row) {
							var paramValue = row[dataParam];
							if (paramValue !== null) {
								var itemName = obj.data.charAt(0).toUpperCase() + obj.data.substr(1); // ilk harf büyültülür.
								var value = row[obj["data"]];

								//todo bertan
								let rString = `<select id="${itemName}" name="${itemName}" class="form-control form-control-xs" data-sel2="false" data-firstEmpty="true" data-type="static" data-method="${datamethod}" data-action="GetAll"   data-text="ad" data-value="id" data-param="${paramValue}" value="${value}">
                                </select>`;

								return rString;
							}
							return "";
						};
						obj["width"] = "auto";
					} else if ($(this).data("type") == "number") {
						obj["width"] = "80px";
						obj["data"] = $(this).data("col");
						obj["render"] = function (data, type, row) {
							if (data !== null) {
								let rString = `<input type="number"  name="${
									obj.data
								}" data-type="number" step="0.0001" class="form-control form-control-xs text-right " value="${data}" ${
									isReadOnly ? "disabled" : ""
								}/>`;
								if (row["odemeHesapTur"] == 40)
									rString = `<input type="number"  name="${
										obj.data
									}" data-type="number" step="0.01"   class="form-control form-control-xs text-right   " value="${data}" ${
										isReadOnly ? "disabled" : ""
									}/>`;
								return rString;
							}

							return data;
						};
					} else if ($(this).data("type") == "date") {
						obj["width"] = "auto";
						obj["data"] = $(this).data("col");
						obj["render"] = function (data, type, row) {
							if (data !== null) {
								let rString = `<input type="date"  name="${obj.data}" data-type="date" value="${obj.data}"  ${
									isReadOnly ? "disabled" : ""
								}/>`;
								return rString;
							}
							return data;
						};
					} else if ($(this).data("type") == "bool") {
						obj["data"] = $(this).data("col");
						obj["render"] = function (data, type, row) {
							if (data !== null) {
								let rString = `<input type="checkbox" value="${obj.data}"  ${isReadOnly ? "disabled" : ""}/>`;
								return rString;
							}
						};
						obj["width"] = "auto";
					} else {
						// Normal Kolon
						obj["data"] = $(this).data("col");
						obj["render"] = function (data, type, row) {
							if (data == null) {
								data = "";
							}

							let rString = startDiv.replace("ALIGN", tAlign);
							rString += `<input type="text" data-type="text" name="${obj.data}" value="${data}"  ${
								isReadOnly ? "disabled" : ""
							}/>`;
							rString += endDiv;
							return rString;
						};
					}
					obj["orderable"] = false;

					cols.push(obj);
				});
				return cols;
			},
			DynamicRowCallback: function (row, data, tblName) {
				// https://datatables.net/reference/option/rowCallback
				tblName = tblName.replace("#", "");
				const dId = data.id ?? data.Id;
				row.dataset.id = dId;
				const btnObjects = $(row.childNodes).last().find("select");
				$.each(btnObjects, function (key, htmlEl) {
					if ($(htmlEl).is("select")) {
						var maasDonemId = $("#MaasDonemIdMain").val();

						var param = $(htmlEl).data("param");

						if (maasDonemId != null) {
							param = param + ":" + maasDonemId;
						}

						var pVal = $(htmlEl).val();
						iTech.Forms.Helpers.comboDoldur(htmlEl, param, pVal);

						$(htmlEl).val(data.odemeGrupAltId);
					}
					//if ($(htmlEl).is("input")) {
					//    if ($(htmlEl).data("type") === "switcher") {
					//        $(htmlEl).attr("id", tblName + "Switcher" + dId);
					//        $(htmlEl).prop("checked", data.isActive);
					//        $(htmlEl).next().attr("for", tblName + "Switcher" + dId);
					//    }
					//};
					//$(htmlEl).data("id", dId);
				});
				return btnObjects;
			},
			GetDynamicTblData: (tableId) => {
				//  Gizli Kolon(lar) için tutucu dizi (variable).
				var hiddenColumnsArr = [];

				// selector
				var table = $(`${tableId}`);

				// headings satırında data-hidden attr varsa
				if (table.find(`thead tr:first`).hasAttr(`data-hidden`))
					hiddenColumnsArr = table.find(`thead tr:first`).attr(`data-hidden`).split(`,`);

				// tablo satırları
				const tableRows = table.find(`tbody tr`);

				// Method Sonunda Geri Döneceğimiz Array
				var rArr = [];

				// Algorithm
				// 1) Her bir satır için
				$.each(tableRows, (index, rowEl) => {
					// geçici obje.
					var tempObj = {};

					// satırdaki kolonlar
					const rowColumns = $(rowEl).find("td");

					// her bir kolon için
					$.each(rowColumns, (i, colEl) => {
						// kolon hedefleme.
						const col = $(colEl);

						// kolon içerisindeki element(ler)
						const innerElement = col.find("input,select");
						if (!innerElement.length) return; // Sütunda element işlem yapmak gereksiz.

						//const isReadOnly = innerElement.hasAttr("readonly"); // readonly alan mı kontrolü. (sonra kullanılabilir.)

						var elName = innerElement.attr("name"); // Objede kullanılacak olan 'Key', adını elementinden alır.
						elName = elName.charAt(0).toUpperCase() + elName.substr(1); // ilk harf büyültülür.

						// elementlere göre değer atamaları yapılır.
						// element input ise
						if (innerElement.is("input")) {
							// input ama [text mi, number mı, date mi]
							const elType = innerElement.attr("data-type");

							switch (elType) {
								case "number":
									var colVal = parseFloat(innerElement.val());
									tempObj[elName] = colVal;
									break;
								case "date":
									tempObj[elName] = innerElement.val(); //datetime kontrol edilecek. (revize gerekebilir.)
									break;
								case "checkbox":
									tempObj[elName] = innerElement.prop("checked");
									break;
								default: //text'tir yani.
									tempObj[elName] = innerElement.val();
							}
						}

						// element select ise
						if (innerElement.is("select")) {
							tempObj[elName] = innerElement.val();
						}
					});

					// hidden alan var ise dönecek array'e eklenir.
					if (hiddenColumnsArr.length) {
						// datatable dan bu row'un tüm verisi okunuyor. (hidden alanlar dahil)
						var rowData = $(`${tableId}`).DataTable().row(index).data();
						//console.log(rowData,"rowData"); => kontrol edebilirsin.
						if (rowData) {
							// her bir gizlenmiş kolon için
							$.each(hiddenColumnsArr, (i, hdnKey) => {
								// geçici objeye rowData'dan eşleşen key ile ekleme yapılıyor.
								tempObj[hdnKey] = rowData[hdnKey];
							});
						}
					}
					if (tempObj.hasOwnProperty("OdemeGrupAltId"))
						if (tempObj["OdemeGrupAltId"] > 0 && tempObj["Deger"] == 0) tempObj["Deger"] = 1;
					// geçici obje, dönecek olan array'e eklenir.(push edilir)
					rArr.push(tempObj);
				});

				//console.log(rArr,`${tableId} tablosunun verisi`);
				return rArr;
			},
		},
		IsDataTable: ($table) => $.fn.DataTable.isDataTable($table),
		Config: {
			// DataTable Konfigürasyonu buraya yazılacak.
			DomString: "DomString Burada Olacak",
		},
	},
	Select2: {
		Load: {
			WithAjax: function (selector, url, type = FormMethod.Post, $selectionMethod, $selectionUrl, $viewKey) {
				// Set up the Select2 control
				$("#" + selector).select2({
					ajax: {
						url: apiBaseUrl + url,
						type: type,
						processResults: function (data) {
							// Transforms the top-level key of the response object from 'items' to 'results'
							return {
								results: data.data,
							};
						},
					},
				});

				//// Fetch the preselected item, and add to the control
				//var studentSelect = $("#" + selector);
				//$.ajax({
				//    type: $selectionMethod,
				//    url: apiBaseUrl + $selectionUrl
				//}).then(function(data) {
				//    // create the option and append to Select2
				//    data = data.userRoles;
				//    const option = new Option($viewKey, data.id, true, true);
				//    studentSelect.append(option).trigger("change");

				//    // manually trigger the `select2:select` event
				//    studentSelect.trigger({
				//        type: "select2:select",
				//        params: {
				//            data: data
				//        }
				//    });
				//});
			},
		},
		/**
         * @param {string} selector      "Kulanılan select elementinin id'si.
         * @param {object} $resultObj    Liste olarak ajax ile gelen data.
         * @param {string} $resultObjKey Gelen listenin hangi parametresi(keyword) ile çalışacağımızı belirtiyoruz.
         * @param {object} $targetObj    Çoklu seçimlerdeki ajax ile ayrı yeten çektiğimiz hedef objemiz. (Data base kayıtlı olan önceki seçtiklerimiz.)  !!!MULTIPLE!!!
         * @param {string} $targetObjKey Tekli or Çoklu fark etmeksizin hedef bir keyword veririz. Select'imiz verdiğimiz bu değerle oluşur.
                                         Tekli select işlemlerde doğrudan değeri.
                                         Çoklu select işlemlerde ise hedef object($targetObj)'in keyword'ünü veririz.
         * @param {string} $viewKey      Kullanıcıya listelenecek olan yani select box da bizim görebileceğimiz değer belirttiğimiz keyword.  ($resultObj sonuç objemizin keywordü)
         * @param {string} $idName       Select2 içerisindeki Options'ların alacağı Value değerlerini belirttiğimiz keyword.
         * @param {boolean} isChoice     Select2'nun ilk option'ı olan -> "<option> Lütfen Bir Seçim Yapınız... </option>" seçeneğini ekler.
         */
		Select: function (
			selector,
			$resultObj,
			$resultObjKey,
			$targetObj = null,
			$targetObjKey = null,
			$viewKey,
			$idName = "id",
			isChoice = true
		) {
			$("#" + selector + " option").remove();
			let op = "";
			let defaultOpt;
			isChoice ? (defaultOpt = "<option value=''> Bir Seçim Yapın </option>") : (defaultOpt = "");
			for (let index = 0; index < $resultObj.length; index++) {
				let select = "";
				op += "<option" + _;
				if ($targetObj !== null) {
					// Multi Select
					for (let i = 0; i < $targetObj.length; i++) {
						if ($resultObj[index][$resultObjKey] === $targetObj[i][$targetObjKey]) select = "selected";
					}
					op += "id='" + selector + $resultObj[index].id + "'" + _;
				} else {
					// Single Select
					if ($targetObj == null && $resultObj[index][$resultObjKey] === $targetObjKey) select = "selected";
					op += "id='" + selector + $resultObj[index][$resultObjKey] + "'" + _;
				}
				op += "value = '" + $resultObj[index][$idName] + "'" + _;
				op += select + ">";
				op += $resultObj[index][$viewKey];
				op += "</option>";
			}
			return $("#" + selector)
				.append(defaultOpt + op)
				.select2();
		},
		SelectWithAjaxSearch: function ($selector, $method, $filter = "id", $delay = 250) {
			$($selector).select2({
				ajax: {
					url: iTech.Defaults.ApiBaseUrl + $method,
					dataType: "json",
					delay: $delay,
					data: function (params) {
						return {
							q: params.term, // search term
							page: params.page || 1,
						};
					},
					beforeSend: function (jqXhr) {
						jqXhr.setRequestHeader("Authorization", "Bearer " + iTech.User.GetToken());
					},
					processResults: function (data, params) {
						params.page = params.page || 1;

						var results = [];
						$.each(data.personelSearchResults, function (k, v) {
							results.push({ id: v[$filter], text: v.text });
						});

						return {
							results: results,
							pagination: { more: params.page * 30 < data.personelSearchResults.length },
						};
					},
					cache: true,
				},
				placeholder: "Aranacak personelin adını giriniz...",
				//escapeMarkup: function (markup) {
				//    return markup;
				//},
				minimumInputLength: 1,
				templateResult: (repo) => {
					if (repo.loading) {
						return repo.text;
					}
					var $container = $(
						`<div class='select2-result-repository clearfix'>
                                    <div class='select2-result-repository__meta'>
                                        <div class='select2-result-repository__title'> </div>
                                    </div>
                                </div>`
					);

					$container.find(".select2-result-repository__title").text(repo.text);

					return $container;
				},
				templateSelection: (repo) => {
					return repo.text;
				},
			});
		},
		SearchPersonelWithAjaxDetail: function ($selector, $method, $filter = "id", $delay = 250) {
			$($selector).select2({
				ajax: {
					url: iTech.Defaults.ApiBaseUrl + $method,
					dataType: "json",
					delay: $delay,
					data: function (params) {
						return {
							q: params.term, // search term
							page: params.page || 1,
						};
					},
					beforeSend: function (jqXhr) {
						jqXhr.setRequestHeader("Authorization", "Bearer " + iTech.User.GetToken());
					},
					processResults: function (data, params) {
						params.page = params.page || 1;

						var results = [];

						$.each(data, function (k, v) {
							results.push({
								id: v[$filter],
								text: v.adSoyad,
								profilImg: v.profilResim,
								dahili: v.dahili,
								unvanAd: v.unvanTanimIdAd,
								birimAd: v.kurumTanimIdGorevAd,
								searchText: params.term,
							});
						});

						return {
							results: results,
							pagination: { more: params.page * 30 < data.length },
						};
					},
					cache: true,
				},
				placeholder: "Aranacak personelin adını giriniz...",
				//escapeMarkup: function (markup) {
				//    return markup;
				//},
				minimumInputLength: 1,
				templateResult: (repo) => {
					if (repo.loading) {
						return repo.text;
					}

					//var $container = $(
					//    `
					//                                    <div class="row">
					//                <div class='col-1 select2-result-repository__avatar'><img src='${repo.profilImg}' style='width: 4.5rem;
					//        height: 4.5rem;' /></div>
					//                <div class="col-10">
					//                    <div class="row">
					//                        <div class="col-12">
					//                            <span style="font-size:15px;font-weight:500;">${repo.text}</span>
					//                        </div>
					//                    </div>
					//                    <div class="row">
					//                        <div class="col-12">
					//                            <span style="font-size:12px;font-weight:200;">  ${repo.unvanAd} </span>
					//                        </div>
					//                        <div class="col-12">
					//                            <span style="font-size:10px; font-weight:200;">  ${repo.birimAd} </span>
					//                        </div>
					//                    </div>
					//                    <div class="row">
					//                        <div class="col-6">
					//                            <span style="font-size:12px; font-weight:100;"><i class="fa fa-phone fx-2 mr-2"></i>   ${repo.dahili}</span>
					//                        </div>
					//                    </div>
					//                </div>
					//            </div>
					//    `
					//);

					var $container = $(
						`  
                                         <div class="row">
                                        <div class="col-10">
                                            <div class="row">
                                                <div class="col-12">
                                                    <span style="font-size:15px;font-weight:500;">${repo.text}</span>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-12">
                                                    <span style="font-size:12px;font-weight:200;">  ${repo.unvanAd} </span>
                                                </div>
                                                <div class="col-12">
                                                    <span style="font-size:10px; font-weight:200;">  ${repo.birimAd} </span>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-6">
                                                    <span style="font-size:12px; font-weight:100;"><i class="fa fa-phone fx-2 mr-2"></i>   ${repo.dahili}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                            `
					);

					//$container.find(".select2-result-repository__forks").append(repo.forks_count + " Forks");
					//$container.find(".select2-result-repository__stargazers").append(repo.stargazers_count + " Stars");
					//$container.find(".select2-result-repository__watchers").append(repo.watchers_count + " Watchers");

					return $container;
				},
				templateSelection: (repo) => {
					return repo.searchText;
				},
			});
		},
		FormatRepo: function (repo) {},
		FormatRepoSelection: function (repo) {},
	},
	lclStr: {
		get: function ($key) {
			const jsonStr = localStorage.getItem($key);
			let result;
			try {
				result = $.parseJSON(jsonStr);
			} catch (ex) {
				result = jsonStr;
			}
			return result;
		},
		set: function ($key, $data) {
			localStorage.setItem($key, JSON.stringify($data));
		},
		rem: function ($key) {
			localStorage.removeItem($key);
		},
	},
	Convert: {
		ToBase62: function (param) {
			var s = param.toString();
			var digits = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
			var result = 0;
			for (var i = 0; i < s.length; i++) {
				var p = digits.indexOf(s[i]);
				if (p < 0) {
					return NaN;
				}
				result += p * Math.pow(digits.length, s.length - i - 1);
			}
			return result;
		},
		FromBase62: function (n) {
			if (n === 0) {
				return "0";
			}
			var digits = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
			var result = "";
			while (n > 0) {
				result = digits[n % digits.length] + result;
				n = parseInt(n / digits.length, 10);
			}

			return result;
		},

		ToObj: function (serializedDataArray) {
			var rObj = {};

			$.each(serializedDataArray, function (i, obj) {
				const objData = obj.name.split(".");
				if (objData.length > 1) {
					if (typeof rObj[objData[0]] == "undefined") {
						rObj[objData[0]] = {};
					}
					rObj[objData[0]][objData[1]] = obj.value;
				} else rObj[obj.name] = obj.value;
			});

			return rObj;
		},
		ToInt: function (string) {
			return parseInt(string);
		},
		ToString: function (s) {
			return s.ToString();
		},
		StringToJson: function (s) {
			return $.parseJSON(s);
		},
		ToBoolean: function (text) {
			return text.length;
		},
		BoolToInt: function (boolVal) {
			return boolVal ? 1 : 0;
		},
		ListOfArrToObj: function (arr) {
			try {
				const obj = {};
				$.each(arr, (key, value) => (obj[key] = value));
				return obj;
			} catch (ex) {
				console.log(ex);
			}
		},
		ToDateString: (dateTimeString) =>
			dateTimeString != null ? dateTimeString.substring(0, 10).split("-").reverse().join("/") : "",
		ImageToBase64String: (file) => {
			//async
			return new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.readAsDataURL(file);
				reader.onload = () => resolve(reader.result);
				reader.onerror = (error) => reject(error);
			});
		},
	},
	Defaults: {
		Language: "tr",
		ApiBaseUrl: "",
	},
	getApiData: function (controller, action, method = "GET", paramData = {}, useToken = true) {
		try {
			var result = {};
			$.ajax({
				url: iTech.Defaults.ApiBaseUrl + controller + "/" + action,
				type: method,
				async: false,
				data: paramData,
				beforeSend: function (jqXhr) {
					if (useToken) {
						jqXhr.setRequestHeader("Authorization", "Bearer " + iTech.User.GetToken());
					}
				},
			})
				.done(function (data, textStatus, jqXhr) {
					result.success = true;
					result.data = data;
					result.message = "";
				})
				.fail(function (jqXHR, textStatus, errorThrown) {
					result.success = false;
					result.message = jqXHR;
				});
		} catch (e) {
			console.log(e);
			iTech.UI.ShowValidationMessages(e.status, e.responseJSON, e.responseText);
		}
		return result;
	},
	Forms: {
		Generate: ($formName = "") => {
			// selectTipi'ne göre eventHandler Eklendi mi - kontrolü yapılabilir (extra)(gereksiz şimdilik)
			$.each(dtSelects, (i, htmlEl) => {
				var inModal = $(htmlEl).closest("div[role='dialog']").length;
				var inTab = $(htmlEl).closest("div[role='tabpanel']").length;
				if (inModal) {
					//console.log("Modal içinde olan select yakalandı:", htmlEl.id);
					var parentModal = $(htmlEl).closest("div[role='dialog']");
					var inTab = $(htmlEl).closest("div[role='tabpanel']");
					var pmId = parentModal.attr("id");
					//console.log("çalıştırılması için modal'ın açılması bekleniyor...", pmId);
					//var elementEvents = $._data($("#" + pmId).get(0), "events");
					//var eventAdded = iTech.Helpers.HasElementEvent(pmId);
					$("#" + pmId).on("show.bs.modal", () => {
						var partials = $("#" + pmId + _ + "div[data-role='partial']");
						if (partials.length) {
							//console.log("modal'ın içerisinde partial(lar) var", partials);
							var parentPartial = $(htmlEl).closest("div[data-role='partial']").attr("id");
							//console.log("bu select ("+ htmlEl.id +") hangi partial'in içerisinde (div#", parentPartial + ")");
							var parentPartialDiv = $("#" + parentPartial);
							if (!parentPartialDiv.hasClass("d-none")) {
								// bu partial gösteriliyor.ö
								//console.log("bu select (" + $(htmlEl).attr("id") + "), gösterimde olduğu için ÇALIŞTIRILIYOR.",);
								iTech.Forms.Helpers.ExecuteSelect(htmlEl);
							} else {
								// gösterilmediği için execute edilmeyecek.
								// burası silinebilir.
								//console.log("bu select (" + $(htmlEl).attr("id") + "), bağlı olduğu partial #" + parentPartial+" 'd-none' classına sahip olduğu için ÇALIŞTIRILMIYOR.", );
							}
						} else {
							//console.log("partial yok direkt modal-body'nin içinde");
							iTech.Forms.Helpers.ExecuteSelect(htmlEl);
						}
					});
				} else if (inTab) {
					var parentModal = $(htmlEl).closest("div[role='tabpanel']");
					var pmId = parentModal.attr("id");

					if (parentModal.hasClass("active")) {
						iTech.Forms.Helpers.ExecuteSelect(htmlEl);
					}

					$(`a[href='#${pmId}']`).on("show.bs.tab", () => {
						var partials = $("div[role='tabpanel']#" + pmId);
						var noLoad = partials.data("noload");
						if (partials.length && !noLoad) {
							iTech.Forms.Helpers.ExecuteSelect(htmlEl);
						}
					});
				} else {
					//console.log("Modal içinde olmayan select yakalandı!",htmlEl.id);
					iTech.Forms.Helpers.ExecuteSelect(htmlEl);
				}
			});
		},
		Helpers: {
			dynamicDoldur: (htmlEl, param = null, value = null) => {
				let splitted = htmlEl.id.split(".");

				if (splitted.length > 1) elName = splitted[1];
				else elName = htmlEl.id;

				const indOfId = elName.indexOf("Id");
				if (indOfId > -1) elName = elName.slice(0, indOfId);

				var datatext = htmlEl.getAttribute("data-text");
				// <select data-firstEmpty='true'
				var isFirstOptionEmpty =
					htmlEl.getAttribute("data-firstEmpty") != null ? htmlEl.getAttribute("data-firstEmpty") == "true" : false;
				var firstText = htmlEl.getAttribute("data-firstText") != null ? htmlEl.getAttribute("data-firstText") : "---";
				var defaultValue = $(htmlEl).attr("value") != null ? $(htmlEl).attr("value") : "";
				var isSelect2 = htmlEl.getAttribute("data-sel2") != null ? htmlEl.getAttribute("data-sel2") == "true" : false;

				var dataParam = htmlEl.getAttribute("data-param"); // <select data-param="1" 'deki param

				if (dataParam == "fvalue") {
					//filter value

					var target = iTech.Helpers.GetUrlParameter("fvalue");
					if (target) dataParam = target;
				}

				if (param) elName = elName + "/" + param;

				if (datatext) {
					var result = iTech.Forms.Helpers.getComboData("Forms", "GetComboData", elName, datatext);
					let optString = "";
					if (isFirstOptionEmpty) optString += "<option value=''>" + firstText + "</option>";

					for (var i = 0; i < result.length; i++) {
						optString += `<option value="${result[i].name}">${result[i].value}</option>`;
					}
					$(htmlEl).html(optString);

					if (defaultValue.length) {
						$(htmlEl).val(defaultValue);
					}

					if (isSelect2) {
						$(htmlEl).select2();
					}
				}
			},
			dynamicTableDoldur: (htmlEl, param = null, value = null) => {
				let splitted = htmlEl.id.split(".");
				if (splitted.length > 1) elName = splitted[1];
				else elName = htmlEl.id;

				const indOfId = elName.indexOf("Id");
				if (indOfId > -1) elName = elName.slice(0, indOfId);

				var datatext = htmlEl.getAttribute("data-text");
				var dataParam = htmlEl.getAttribute("data-param"); // <select data-param="1" 'deki param

				if (dataParam == "fvalue") {
					//filter value

					var target = iTech.Helpers.GetUrlParameter("fvalue");
					if (target) dataParam = target;
				}

				if (param) elName = elName + "/" + param;

				const formName = $(htmlEl).closest("form").attr("name");
				let selectorId = "[name='" + formName + "'] #" + elName;

				if (datatext) {
					var thead = `<thead>
                            <tr role="row" class="d-none">
                                <th id="allCheck" data-col="selection">
                                    <i class="fas fa-check" style="color: var(--primary);"></i>
                                </th>
                                <th data-col="value"></th>
                            </tr>
                        </thead>`;

					if (iTech.DataTable.IsDataTable(htmlEl)) {
						$(htmlEl).DataTable().destroy();
					}

					if (!$(htmlEl).find("thead").length > 0) $(htmlEl).append(thead);

					if (thead.length > 0) {
						const rule = $(htmlEl).hasAttr("data-rule") ? "/" + htmlEl.getAttribute("data-rule") : "";
						iTech.DataTable.Load.AjaxSourced(
							selectorId,
							"Forms/GetTableData/" + elName.replace("Table", "") + "/" + datatext + rule
						);
					}
				}
			},
			ComboRefreshData: function (htmlEl, target, value = null) {
				const param = htmlEl.value ?? htmlEl.find("option:selected").val();
				var combo = $('[name="' + target + '"]')[0];
				var dataForm = combo.getAttribute("data-form"); // <select data-param="1" 'deki param

				if (param) {
					if (!dataForm) iTech.Forms.Helpers.comboDoldur(combo, param, value);
					else iTech.Forms.Helpers.dynamicDoldur(combo, param, value);
				}
			},
			addLabel: function (item) {
				var label = "<label  for='ti_" + item.id + "' class='form-label'>" + item.etiket + "</label>";
				return label;
			},
			addText: function (item, value) {
				var deger = item.varsayilanDeger;

				if (value) deger = value;
				else if (!deger) deger = "";

				var textItem =
					" <input required type='text' id='ti_" +
					item.id +
					"' class='form-control form-control-xs' placeholder='" +
					item.tanimlayici +
					"' name='ti_" +
					item.id +
					"' value='" +
					deger +
					"' title='" +
					item.ipucu +
					"'";
				if (item.maxDeger > 0) textItem += " maxlength ='" + item.maxDeger + "'";

				textItem += " style ='";

				if (item.ozelStil !== "") textItem += item.ozelStil;
				textItem += "'";
				textItem += "  /> <p asp-validation-for='ti_" + item.id + "' class='text-danger'></p>";

				return textItem;
			},
			addNumber: function (item, value) {
				var deger = item.varsayilanDeger;

				if (value) deger = value;
				var textItem =
					" <input type='number' id='ti_" +
					item.id +
					"' class='form-control form-control-xs'   placeholder='" +
					item.tanimlayici +
					"' name='ti_" +
					item.id +
					"' value='" +
					deger +
					"' title='" +
					item.ipucu +
					"'";

				if (item.maxDeger > 0) textItem += " max ='" + item.maxDeger + "'";

				if (item.minDeger) textItem += " min ='" + item.minDeger + "'";

				textItem += " style ='";

				if (item.ozelStil !== "") textItem += item.ozelStil;
				textItem += "'";
				textItem += "  /> <p asp-validation-for='ti_" + item.id + "' class='text-danger'></p>";

				return textItem;
			},
			addCheck: function (item, value) {
				var deger = item.varsayilanDeger;

				if (value) deger = value;
				var divCheck = " <div class='custom-control custom-switch'>";
				var checkItem =
					divCheck +
					"&nbsp;&nbsp;&nbsp;<input type='checkbox' id='ti_" +
					item.id +
					"' class='custom-control-input' placeholder='" +
					item.tanimlayici +
					"' name='ti_" +
					item.id +
					"' value='" +
					deger +
					"' title='" +
					item.ipucu +
					"'";

				if (deger === "True" || deger === "true" || deger === "1") checkItem += " checked";
				checkItem += ">";
				checkItem += "<label class='custom-control-label' for='ti_" + item.id + "' ></label></div> ";
				checkItem += "<p asp-validation-for='ti_" + item.id + "' class='text-danger'></p>";

				return checkItem;
			},
			addDate: function (item, value) {
				var deger = item.varsayilanDeger;
				if (value) deger = value;

				let today = new Date().toISOString().slice(0, 10);
				if (item.varsayilanDeger === "today") item.varsayilanDeger = today;

				var dateHtml =
					" <input type='date' id='ti_" +
					item.id +
					"' class='form-control form-control-xs' placeholder='" +
					item.tanimlayici +
					"' name='ti_" +
					item.id +
					"' value='" +
					deger +
					"' title='" +
					item.ipucu +
					"'";

				if (item.maxDeger > 0) dateHtml += " max ='" + item.maxDeger + "'";
				if (item.minDeger) dateHtml += " min ='" + item.minDeger + "'";

				dateHtml += " style ='";

				if (item.ozelStil !== "") dateHtml += item.ozelStil;
				dateHtml += "'";
				dateHtml += "  /> ";
				dateHtml += "<p asp-validation-for='ti_" + item.id + "' class='text-danger'></p>";

				return dateHtml;
			},
			addCombo: function (item, value) {
				var deger = item.varsayilanDeger;
				if (value) deger = value;

				var values = item.veriListe;
				var combo =
					" <select class='form-control form-control-xs' id='ti_" +
					item.id +
					"' placeholder = '" +
					item.tanimlayici +
					"' name = 'ti_" +
					item.id +
					"'   title = '" +
					item.ipucu +
					"'>";
				combo += "<option selected></option>";

				var spl = values.split("|");
				for (var i = 0; i < spl.length; i++) {
					var spltVal = spl[i].split("_");
					var selected = "";
					if (deger[0] === spltVal) selected = "selected";
					combo += "<option value='" + deger[0] + "' " + selected + ">" + deger[1] + "</option>";
				}

				combo += "</select >  ";
				combo += "<p asp-validation-for='ti_" + item.id + "' class='text-danger'></p>";

				return combo;
			},
			comboChanged(e, value = null) {
				var combos = $("select[id^='" + e.id + "_ci" + "']");
				if (combos.length > 0) this.fillCombo(e.value, combos, value);
			},
			addDataCombo: function (id, values, memberName, value) {
				var combo =
					" <select class='form-control form-control-xs' name='ti_" +
					id +
					"' id='ti_" +
					id +
					"' onchange=iTech.Forms.Helpers.comboChanged(this)>";
				combo += "<option selected></option>";

				for (var i = 0; i < values.length; i++) {
					combo +=
						value == values[i]["id"] || value == String(values[i]["id"])
							? "<option selected value='" + values[i]["id"] + "'>" + values[i][memberName] + "</option>"
							: "<option value='" + values[i]["id"] + "'>" + values[i][memberName] + "</option>";
				}

				combo += "</select > ";
				combo += "<p asp-validation-for='ti_" + id + "' class='text-danger'></p>";

				return combo;
			},
			getChildData: function (item, value) {
				var combo =
					" <select  data-parent='ti_" +
					item.ustId +
					"' data-type='related' data-value='" +
					value +
					"'  class='form-control form-control-xs' name='ti_" +
					item.id +
					"_ci_" +
					item.ustId +
					"' id='ti_" +
					item.ustId +
					"_ci_" +
					item.id +
					"' veriListe='" +
					item.veriListe +
					"'>";
				combo += "<option selected>Seçim Yapınız.</option>";
				combo += "</select > ";
				combo += "<p asp-validation-for='ti_" + item.ustId + "_ci_" + item.id + "' class='text-danger'></p>";

				return combo;
			},
			getData: function (item, value) {
				var controllerList = item.veriListe.split("|");

				const result = iTech.getApiData(controllerList[0], controllerList[1], "GET");
				if (result.success) {
					var combo = this.addDataCombo(item.id, result.data, controllerList[2], value);
					return combo;
				}

				return false;
			},
			fillCombo: function (selValue, combos, value = null) {
				for (var i = 0; i < combos.length; i++) {
					var combo = combos[0];
					combo.options.length = 0;
					combo.append(new Option("Seçim Yapınız.", ""));
					var controllerList = combo.attributes.veriListe.value.split("|");

					const result = iTech.getApiData(controllerList[0], controllerList[1] + "/" + selValue, "GET");
					if (result.success) {
						for (var l = 0; l < result.data.length; l++) {
							var selected = false;
							if (value) {
								if (value == result.data[l]["id"]) selected = true;
							}
							combo.append(new Option(result.data[l][controllerList[2]], result.data[l]["id"], selected, selected));
						}
					}
				}
			},
			getComboData: function (controllerName, action, NormalizeAd, FieldText) {
				const result = iTech.getApiData(controllerName + "/" + action, NormalizeAd + "/" + FieldText, "GET");
				return result.success ? result.data : null;
			},
			jsShortGuid: function () {
				var uuid = Math.random().toString(36).slice(-6);
				return "IT" + uuid + "_";
			},
			comboDoldur: function (htmlEl, param = null, value = null) {
				try {
					let params;
					if (param != null) {
						if (param.indexOf(":") > 0) {
							params = param.split(":");
						}
					}

					let splitted = htmlEl.id.split(".");
					if (splitted.length > 1) elName = splitted[1];
					else elName = htmlEl.id;

					const indOfId = elName.indexOf("Id");
					if (indOfId > -1) elName = elName.slice(0, indOfId);

					var dataValue = htmlEl.getAttribute("data-value");
					var dataText = htmlEl.getAttribute("data-text");
					var isFirstOptionEmpty =
						htmlEl.getAttribute("data-firstEmpty") != null ? htmlEl.getAttribute("data-firstEmpty") == "true" : false;
					var firstText = htmlEl.getAttribute("data-firstText") != null ? htmlEl.getAttribute("data-firstText") : "---";
					var defaultValue = $(htmlEl).attr("value") != null ? $(htmlEl).attr("value") : "";
					var defaultText = $(htmlEl).attr("text") != null ? $(htmlEl).attr("text") : "";
					var dataMethod = htmlEl.getAttribute("data-method");
					var dataParam = htmlEl.getAttribute("data-param"); // <select data-param="1" 'deki param

					var hasExtraFields = $(htmlEl).hasAttr("data-fields");

					if (dataParam == "fvalue") {
						//filter value

						var target = iTech.Helpers.GetUrlParameter("fvalue");
						if (target) dataParam = target;
					}
					var dataAction = htmlEl.getAttribute("data-action");
					var isSelect2 = htmlEl.getAttribute("data-sel2") != null ? htmlEl.getAttribute("data-sel2") == "true" : false;

					if (dataText) {
						var actionName = dataAction + "/" + elName;

						if (!param && dataParam) actionName = actionName + "/" + dataParam;
						if (param && !param.includes(":")) actionName = actionName + "/" + param;
						if (params != null) actionName = actionName + "/" + params[0] + "/" + params[1];

						const result = iTech.getApiData(dataMethod, actionName);
						let optString = "";
						if (isFirstOptionEmpty) optString += "<option value=''>" + firstText + "</option>";

						for (var i = 0; i < result.data.length; i++) {
							var extraFieldsTxt = "";
							if (hasExtraFields) {
								var extraFieldsArr = $(htmlEl).data("fields").split(",");
								for (var j = 0; j < extraFieldsArr.length; j++) {
									extraFieldsTxt += _ + "data-" + extraFieldsArr[j] + "='" + result.data[i][extraFieldsArr[j]] + "'";
								}
							}

							if (result.data[i][dataText] != "Tanımsız") {
								var splitText = dataText.split(",");
								if (splitText.length == 1)
									optString += `<option value="${result.data[i][dataValue]}" ${extraFieldsTxt}>${result.data[i][dataText]}</option>`;
								else {
									optString += `<option value="${result.data[i][dataValue]}" ${extraFieldsTxt}>`;
									for (let sIndex = 0; sIndex < splitText.length; sIndex++) {
										optString += ` ${result.data[i][splitText[sIndex]]} `;
									}
									optString += `</option>`;
								}
							} else optString += "<option value='' >" + firstText + "</option>";

							if (defaultText.length && defaultText == result.data[i][dataText]) defaultValue = result.data[i][dataValue];
						}
						$(htmlEl).html(optString);

						if (defaultValue != "") $(htmlEl).val(defaultValue);

						if (value) $(htmlEl).val(value);

						if (isSelect2) $(htmlEl).select2();
					}
				} catch (err) {
					console.log("%c (!) COMBODOLDUR (!) \n", "background: red", err);
				}
			},
			treeDoldur: function (htmlEl) {
				let splitted = htmlEl.id.split(".");
				if (splitted.length > 1) elName = splitted[1];
				else elName = htmlEl.id;

				var dataMethod = htmlEl.getAttribute("data-method");
				var dataAction = htmlEl.getAttribute("data-action");

				var endPoint = dataMethod + "/" + dataAction;

				const result = iTech.Services.Ajax(FormMethod.Get, endPoint);
				if (result.success) {
					var data = result.data;
					$.each(result.data, function (index, obj) {
						if (obj.parent === "#") {
							obj.icon = "//" + appFolder.images + "/tree-view-icons/SBBx16.png";
						} else {
							obj.icon = "//" + appFolder.images + "/tree-view-icons/birim.png";
						}
					});
					iTech.Forms.Helpers.makeJsTree(data, htmlEl);
				} else iTech.ShowMessage("dashboard.TreeView", "common.DataNotFound", "error");
			},
			makeJsTree: function ($data, $htmlEl) {
				var dataPageName = $htmlEl.getAttribute("data-pagename");
				var threeState = $htmlEl.getAttribute("data-threestate");
				var multiple = $htmlEl.getAttribute("data-multiple");
				var checbox = $htmlEl.getAttribute("data-checkbox") == null ? true : $htmlEl.getAttribute("data-checkbox");
				if ($($htmlEl).jstree("get_selected").length > 1) return;

				if ($($htmlEl).jstree(true)) {
					$($htmlEl).jstree().destroy();
				}

				$($htmlEl)
					.jstree({
						core: {
							strings: {
								"Loading ...": "Yükleniyor...",
							},
							data: $data,
							multiple: multiple == "true" ? true : false,
							themes: {
								icons: false,
							},
						},
						checkbox: {
							keep_selected_style: true,
							three_state: threeState == "true" ? true : false,
						},
						check_callback: false,
						plugins: !checbox ? ["search", "checkbox", "sort", "changed"] : ["search", "sort", "changed"],
					})
					.bind("changed.jstree", function (e, data) {
						let selectData = data["selected"];
						selectData.unshift("1");
						if ($($htmlEl).hasAttr("data-pagename")) {
							window[dataPageName].Variables.UnitsData = $data
								.filter((x) => selectData.includes(x.id))
								.sort(function (a, b) {
									return a.id - b.id || a.name.localeCompare(b.name);
								});
						}
					})
					.bind("ready.jstree", function () {
						$($htmlEl).jstree("open_node", "700036");
					})
					.on("select_node.jstree deselect_node.jstree", function (e, data) {
						if (threeState == "false" ? true : false) {
							var children = iTech.Forms.Helpers.getAllChildrenNodes(data.node.id, [], $htmlEl);
							e.type == "select_node"
								? children.forEach(function (node) {
										$($htmlEl).jstree("select_node", node);
								  })
								: children.forEach(function (node) {
										$($htmlEl).jstree("deselect_node", node);
								  });
						}
					})
					.init("loading.jstree", function () {
						if ($($htmlEl).siblings().length > 0) iTech.Forms.Helpers.treeSearchHandler($($htmlEl).siblings(), $htmlEl);
					});
			},
			treeSearchHandler: function ($htmlEl, $treeEl) {
				$($htmlEl)
					.off()
					.on("keyup", function () {
						var to = false;
						if (to) {
							clearTimeout(to);
						}
						to = setTimeout(function () {
							const v = $($htmlEl).val();
							$($treeEl).jstree(true).search(v);
						}, 250);
					});
			},
			getAllChildrenNodes: function (parentNode, children = [], $htmlEl) {
				var node = $($htmlEl).jstree("get_node", parentNode);
				children.push(node.id);
				if (node.children) {
					for (var i = 0; i < node.children.length; i++) {
						iTech.Forms.Helpers.getAllChildrenNodes(node.children[i], children, $htmlEl);
					}
				}
				return children;
			},
			staticTableDoldur: function (htmlEl) {
				try {
					if (htmlEl != null) {
						let elName = htmlEl.id;

						let splitted = htmlEl.id.split(".");
						if (splitted.length > 1) elName = splitted[1];
						else elName = htmlEl.id;

						const indOfId = elName.indexOf("Id");
						if (indOfId > -1) elName = elName.slice(0, indOfId);

						var dataText = htmlEl.getAttribute("data-text");
						var dataMethod = htmlEl.getAttribute("data-method");
						var dataAction = htmlEl.getAttribute("data-action");

						if (dataText) {
							var actionName = dataAction + "/" + elName.replace("Table", "");
							const formName = $(htmlEl).closest("form").attr("name");
							let selectorId = "[name='" + formName + "'] #" + elName;

							var thead = `<thead>
                                            <tr role="row" class="d-none">
                                                <th id="allCheck" data-col="selection">
                                                    <i class="fas fa-check" style="color: var(--primary);"></i>
                                                </th>
                                                <th data-col="${dataText.substr(0, 1).toLowerCase() + dataText.substr(1)}"></th>
                                            </tr>
                                        </thead>`;

							if (iTech.DataTable.IsDataTable(htmlEl)) {
								$(htmlEl).DataTable().destroy();
							}

							if (!$(htmlEl).find("thead").length > 0) $(htmlEl).append(thead);

							iTech.DataTable.Load.AjaxSourced(selectorId, dataMethod + "/" + actionName);
						}
					}
				} catch (err) {
					console.log("%c (!) TableDOLDUR (!) \n", "background: red", err);
				}
			},
			fillComboData: function (
				combo,
				controller,
				action,
				paramData = null,
				value = null,
				formMethod = FormMethod.Get,
				type = false,
				useToken = true
			) {
				combo.options.length = 0;
				var isFirstOptionEmpty =
					combo.getAttribute("data-firstEmpty") != null ? combo.getAttribute("data-firstEmpty") == "true" : false;
				var firstText = combo.getAttribute("data-firstText") != null ? combo.getAttribute("data-firstText") : "---";
				var defaultValue = $(combo).attr("value") != null ? $(combo).attr("value") : "";
				var isSelect2 = combo.getAttribute("data-sel2") != null ? combo.getAttribute("data-sel2") == "true" : false;
				var datatext = combo.getAttribute("data-text");
				var datavalue = combo.getAttribute("data-value");
				let result;
				if (type) {
					result = iTech.getApiData(controller, action, formMethod, {}, useToken);
				} else {
					result = iTech.getApiData(controller, action, formMethod, paramData, useToken);
				}
				if (result.success) {
					if (isFirstOptionEmpty) combo.append(new Option(firstText, "", selected, selected));
					for (var l = 0; l < result.data.length; l++) {
						var selected = false;
						if (value) {
							if (value == result.data[l][datavalue]) selected = true;
						}

						combo.append(new Option(result.data[l][datatext], result.data[l][datavalue], selected, selected));
					}
					if (defaultValue.length) {
						$(combo).val(defaultValue);
					}
					if (isSelect2) {
						$(combo).select2();
					}
				}
			},
			ExecuteSelect: function (htmlEl) {
				var dType = $(htmlEl).data("type");
				// dynamic  => dynamicDoldur
				// static   => comboDoldur
				switch (dType) {
					case "dynamicTable":
						iTech.Forms.Helpers.dynamicTableDoldur(htmlEl);
						break;
					case "staticTable":
						iTech.Forms.Helpers.staticTableDoldur(htmlEl);
						break;
					case "dynamic":
						iTech.Forms.Helpers.dynamicDoldur(htmlEl);
						break;
					case "static":
						iTech.Forms.Helpers.comboDoldur(htmlEl);
						break;
					case "tree":
						iTech.Forms.Helpers.treeDoldur(htmlEl);
						break;
				}
			},
			SerializeArray: function (inputs) {
				let data = inputs.serializeArray();
				data = iTech.Convert.ToObj(data);
				$.each(inputs, (index, htmlEl) => {
					const el = $(htmlEl);
					if (el.attr("type") === "checkbox") {
						data[el.attr("name")] = el.prop("checked");
					}
					//if (el.attr("type") === "number" && el.hasAttr("step")) {
					//    const floatVal = parseFloat(el.val().replace(",", "."));
					//    data[el.attr("name")] = floatVal;
					//}
				});
				return data;
			},
		},
	},
	Generated: {
		OpenMdl: function (id, formName, methodName) {
			iTech.Helpers.ClearForm(formName);
			$("#" + formName + "Modal")
				.modal("show")
				.on("keyup", function (e) {
					if (e.keyCode == 13) {
						var methodName = window[formName + "Page"].Variables.SaveMethod;
						iTech.Generated.Save(formName, methodName);
					}
				});
			if (id != null && id !== "" && id !== _strings.emptyGuid && id > 0) {
				// Edit
				const result = iTech.Services.Ajax(FormMethod.Get, methodName + "/" + id);
				iTech.Helpers.Map(formName + "Form", result.data);
				return result;
			} else {
				// Create
				const idValType = $("form[name='" + formName + "Form'] input[name='Id']").data("id-type");
				if (idValType === "number") {
					$("form[name='" + formName + "Form'] input[name='Id']").val("0");
				} else {
					$("form[name='" + formName + "Form'] input[name='Id']").val(_strings.emptyGuid);
				}
			}
		},
		Save: function (formName, methodName) {
			if (!iTech.Helpers.ValidateForm(formName + "Form")) return null;
			let inputs = $("form[name='" + formName + "Form']").find("input,select,textarea");
			const data = iTech.Forms.Helpers.SerializeArray(inputs);

			return iTech.Generated.SaveFormData(formName, methodName, data);
		},
		SavePrivate: function (formName, methodName) {
			let inputs = $("form[name='" + formName + "Form']").find("input,select,textarea");
			const data = iTech.Forms.Helpers.SerializeArray(inputs);
			return iTech.Generated.SaveFormData(formName, methodName, data);
		},
		SaveFormData: function (formName, methodName, data) {
			if (data.hasOwnProperty("Id")) if (data.Id == "") data.Id = 0;
			const result = iTech.Services.Ajax(FormMethod.Post, methodName, data);
			if (result["success"] === true) {
				iTech.ShowMessage("İşlem Sonucu", "Kaydetme İşlemi Başarılı");
				// Eğer Sayfada FormAdıTable varsa tabloyu refresh'ler
				if ($("table#" + formName + "Table").length) iTech.DataTable.Refresh.Tables("#" + formName + "Table");
				// Eğer Bu pop-up ise , pop-up'ı kapatır.
				if ($("#" + formName + "Modal").length) $("#" + formName + "Modal").modal("hide");
				return result;
			} else {
				if (result.message.responseText) iTech.ShowMessage("Hatalı İşlem", result.message.responseText, "error");
				else iTech.ShowMessage("Hatalı İşlem", result.message, "error");
			}
		},
		Delete: async function (id, formName, methodName) {
			const deleteConfirmed = await iTech.UI.AskConfirmation();
			if (!deleteConfirmed) return false;
			let result = null;
			try {
				result = iTech.Services.Ajax(FormMethod.Delete, methodName + "/" + id);
			} catch (ex) {
				console.log(ex);
			} finally {
				if (result) {
					iTech.ShowMessage("İşlem Sonucu", "Silme İşlemi Başarılı");
					// Eğer Sayfada DataTable var ise refreshlenir.
					if ($("#" + formName + "Table").length) iTech.DataTable.Refresh.Tables("#" + formName + "Table");
				} else iTech.ShowMessage("İşlem Sonucu", "Silme İşlemi Sırasında Hata Meydana Geldi!", "error");
			}
		},
	},
	FlatPicker: {
		Init: function (elements, date = null, map = false) {
			$.each(elements, (index, htmlEl) => {
				if ($(htmlEl).attr("data-fixedDate") == "today" && !map) date = new Date();

				if ($(htmlEl).attr("data-mode") == "range") iTech.FlatPicker.Cfg.mode = "range";

				iTech.FlatPicker.Cfg.enableTime =
					typeof $(htmlEl).attr("data-enableTime") != typeof undefined ? $(htmlEl).attr("data-enableTime") : false;
				iTech.FlatPicker.Cfg.static = typeof $(htmlEl).attr("data-enableTime") != typeof undefined ? true : false;
				iTech.FlatPicker.Cfg.altFormat = typeof $(htmlEl).attr("data-enableTime") != typeof undefined ? "d.m.Y H:i" : "d.m.Y";
				iTech.FlatPicker.Cfg.defaultDate = date;

				flatpickr(htmlEl, iTech.FlatPicker.Cfg);
				date = null;
			});
		},
		Cfg: {
			locale: "tr",
			altInput: true, // kullanıcının göreceği formatı enable eder.
			dateFormat: "Y-m-d H:i", // dbye gönderilecek format,
			allowInput: true,
			//onClose: (dateObj, dateStr, instance) => {
			//    const el = $("  #" + instance.element.id);
			//    if (el.hasAttr("data-onClose")) {
			//        var fn = el.attr("data-onClose");
			//        eval(fn);
			//    }
			//}
		},
	},
	SwitchTexts: {
		Init: function () {
			$.each(switches, (index, htmlEl) => {
				var switchEl = $("#" + htmlEl.id);

				var textElements = switchEl.parent("div").attr("switch-text");
				if (textElements == undefined) return;
				var texts = textElements.split(":");

				switchEl.next().html(switchEl.prop("checked") ? texts[0] : texts[1]);

				switchEl.change(function (event) {
					var val = event.target.value;
					switchEl.next().html(texts[iTech.Convert.BoolToInt(!switchEl.prop("checked"))]);
				});
			});
		},
		SetText: function (el, value) {
			$(el).prop("checked", value);
			$(el).trigger("change");
		},
	},
	InputMasks: {
		Init: function () {
			$.each(inputMasks, (index, htmlEl) => {
				$(htmlEl).inputmask();
			});
		},
	},
	Tabs: {
		Init: function () {
			const tabs = tabElement.find("a");
			const initialTabId = $(".tab-pane.active").attr("id");
			const inititalAHref = $("a[href='#" + initialTabId + "']");
			const initialJsPath = inititalAHref.data("js");
			if (tabs.length) {
				// undefined ise bir işlem yapmamaktadır.
				if (typeof initialJsPath != typeof undefined) {
					// inject js
					$("#innerJS script").remove();
					// https
					const jsPath = `${window.location.protocol}//${
						window.location.host
					}/app/pageScripts/${initialJsPath}.js?v=${$.now()}`;
					//// remote insert
					$("<script>", { src: jsPath }).appendTo("#innerJS");
				}
			}

			$.each(tabs, (index, htmlEl) => {
				$(htmlEl).on("shown.bs.tab", function (e) {
					if (typeof $(this).data("js") != typeof undefined) {
						$("#innerJS script").remove();
						$("<script>", { src: "//" + appFolder.pageScripts + "/" + $(this).data("js") + ".js?v=" + $.now() }).appendTo(
							"#innerJS"
						);
					}
				});
			});
		},
	},
	StaticTexts: {
		Init: () => {},
		SetText: (selectElement) => {
			var selectId = selectElement.id;
			const selectedVal = $("#" + selectId + _ + "option:selected").eq(0);
			var dataFieldsArr = $(selectElement).data("fields").split(","); // adres,
			$.each(dataFieldsArr, (i, e) => {
				const idKey = e.charAt(0).toUpperCase() + e.substr(1); // İlk Harf Büyük Karaktere çevirilir.
				$("#" + idKey).text(selectedVal.data(e));
			});
		},
	},
	ThemeSettings: {
		Reset: function () {
			localStorage.removeItem("themeSettings");
		},
	},
	Html5: {
		Table: {
			GenerateRows: (tableName, requestUrl, formMethod = FormMethod.Get, postData) => {
				const thead = $(tableName + _ + "thead");
				thead.removeClass("d-none");
				const headings = $(tableName + _ + "thead th").sort((t) => t.dataset["col"]);
				const result = iTech.Services.Ajax(formMethod, requestUrl, postData);
				if (result["success"]) {
					$(tableName).find("tbody").remove();
					var rowString = `<tbody>`;
					$.each(result.data, (i, obj) => {
						i % 2 == 0 ? (rowString += "<tr class='odd'> ") : (rowString += "<tr class='even'> ");
						$.each(headings, (i, htmlEl) => {
							let data = obj[$(htmlEl).data("col")];
							if (!data) {
								data = "";
							}
							const tAlign = typeof $(htmlEl).data("align") == typeof undefined ? "left" : $(htmlEl).data("align");
							if ($(htmlEl).data("type") == "date") {
								const dateString = iTech.Convert.ToDateString(data);
								rowString += "<td class='text-" + tAlign + "'>" + dateString + "</td>";
							} else if ($(htmlEl).data("type") == "bool") {
								rowString += "<td class='text-" + tAlign + "'>";
								rowString += data ? "<i class='fa fa-check text-success'></i>" : "<i class='fa fa-times text-danger'></i>";
								rowString += "</td>";
							} else {
								rowString += "<td class='text-" + tAlign + "'>" + data + "</td>";
							}
						});
						rowString += "</tr>";
					});
					rowString += "</tbody>";
					thead.after(rowString);

					const showAsDataTable =
						typeof $(tableName).attr("mode") !== typeof undefined ? $(tableName).attr("mode") == "dt" : false;

					if (showAsDataTable) {
						if (iTech.DataTable.IsDataTable(tableName)) $(tableName).DataTable().destroy();
						$(tableName).DataTable({ dom: "" });
					}

					return result.data.length == 0 ? false : true;
				} else {
					return false;
				}
			},
		},
	},
	MatchHeight: {
		Init: (className) => {
			const options = {
				byRow: true,
				property: "height",
				target: null,
				remove: false,
			};

			$("." + className).matchHeight(options);
		},
		Config: {
			byRow: true,
			property: "height",
			target: null,
			remove: false,
		},
	},
	FormatDateAskerlik: function (dateString) {
		if (dateString) return dateString.split(".").reverse().join("-");
		else return "";
	},
};
