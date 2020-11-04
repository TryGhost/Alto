
	var cookieConsent = new CookieConsent({privacyPolicyUrl: "https://fabio.sauna.re/privacy"})
	if(cookieConsent.trackingAllowed() == true) {
	_paq.push(['setConsentGiven']);
	}
	if(cookieConsent.trackingAllowed() == false) {
	 _paq.push(['forgetConsentGiven']);
	}