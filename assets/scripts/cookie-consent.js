/**
 * Author and copyright: Stefan Haack (https://shaack.com)
 * Repository: https://github.com/shaack/cookie-consent-js
 * License: MIT, see file 'LICENSE'
 */

function CookieConsent(props) {

    var self = this
    this.props = {
        buttonPrimaryClass: "btn btn-primary", // the "accept all" buttons class, only used for styling
        buttonSecondaryClass: "btn btn-secondary", // the "accept necessary" buttons class, only used for styling
        privacyPolicyUrl: "privacy-policy.html",
        autoShowModal: true, // disable autoShowModal on the privacy policy page, to make that page readable
        lang: navigator.language, // the language, in which the modal is shown
        blockAccess: false, // set "true" to block the access to the website _before_ choosing a cookie configuration
        position: "right", // position ("left" or "right"), if blockAccess is false
        content: { // the content in all needed languages
            en: {
                title: "Cookie Consent",
                body: "Can this blog use cookies to enable analytics? " +
                    "--privacy-policy--",
                privacyPolicy: "More details",
                buttonAcceptAll: "Accept",
                buttonAcceptTechnical: "Decline"
            }
        },
        cookieName: "cookie-consent",  // the name of the cookie, the cookie is `true` if tracking was accepted
        modalId: "cookieConsentModal" // the id of the modal dialog element
    }
    for (var property in props) {
        // noinspection JSUnfilteredForInLoop
        this.props[property] = props[property]
    }
    if (this.props.content[this.props.lang] !== undefined) {
        this.lang = this.props.lang
    } else {
        this.lang = "en" // fallback
    }
    var _t = this.props.content[this.lang]
    var linkPrivacyPolicy = '<a href="' + this.props.privacyPolicyUrl + '">' + _t.privacyPolicy + '</a>'
    var modalClass = "cookie-consent-modal"
    if (this.props.blockAccess) {
         modalClass += " block-access"
    }
    this.modalContent = '<div class="' + modalClass + '">' +
        '<div class="modal-content-wrap ' + this.props.position + '">' +
        '<div class="modal-content">' +
        '<div class="modal-header">--header--</div>' +
        '<div class="modal-body">--body--</div>' +
        '<div class="modal-footer">--footer--</div>' +
        '</div></div>'
    this.modalContent = this.modalContent.replace(/--header--/, "<h3 class=\"modal-title\">" + _t.title + "</h3>")
    this.modalContent = this.modalContent.replace(/--body--/,
        _t.body.replace(/--privacy-policy--/, linkPrivacyPolicy)
    )
    this.modalContent = this.modalContent.replace(/--footer--/,
        "<div class='buttons'>" +
        "<button class='btn-accept-necessary " + this.props.buttonSecondaryClass + "'>" + _t.buttonAcceptTechnical + "</button>" +
        "<button class='btn-accept-all " + this.props.buttonPrimaryClass + "'>" + _t.buttonAcceptAll + "</button>" +
        "</div>"
    )

    function setCookie(name, value, days) {
        var expires = ""
        if (days) {
            var date = new Date()
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
            expires = "; expires=" + date.toUTCString()
        }
        document.cookie = name + "=" + (value || "") + expires + "; Path=/; SameSite=Strict; Secure; SameSite=Strict"
    }

    function getCookie(name) {
        var nameEQ = name + "="
        var ca = document.cookie.split(';')
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i]
            while (c.charAt(0) === ' ') {
                c = c.substring(1, c.length)
            }
            if (c.indexOf(nameEQ) === 0) {
                return c.substring(nameEQ.length, c.length)
            }
        }
        return undefined
    }

    function removeCookie(name) {
        document.cookie = name + '=; Path=/; SameSite=Strict; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    }

    function documentReady(fn) {
        if (document.readyState !== 'loading') {
            fn()
        } else {
            document.addEventListener('DOMContentLoaded', fn)
        }
    }

    function hideDialog() {
        this.modal.style.display = "none"
    }

    function showDialog() {
        documentReady(function () {
            this.modal = document.getElementById(self.props.modalId)
            if (!this.modal) {
                this.modal = document.createElement("div")
                this.modal.id = self.props.modalId
                this.modal.innerHTML = self.modalContent
                document.body.append(this.modal)
                this.modal.querySelector(".btn-accept-necessary").addEventListener("click", function () {
                    setCookie(self.props.cookieName, "false", 180)
					location.reload() //reload webpage
                    // hideDialog()
					return false;
                })
                this.modal.querySelector(".btn-accept-all").addEventListener("click", function () {
                    setCookie(self.props.cookieName, "true", 180)
					location.reload() //reload webpage
                    // hideDialog()
					return false;
                })
            } else {
                this.modal.style.display = "block"
            }
        }.bind(this))
    }

    if (getCookie(this.props.cookieName) === undefined && this.props.autoShowModal) {
        showDialog()
    }

    // API
    this.reset = function () {
        removeCookie(this.props.cookieName)
        // showDialog()
    }

    this.trackingAllowed = function () {
        return getCookie(this.props.cookieName) === "true"
    }

}