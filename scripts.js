var indexViewModel = (function () {
	var self = {};
	
	self.tab = "home";
	self.ignoreHashChange = false;
	
	self.init = function () {
		var $document = $(document);
		var $window = $(window);
		$document.on("click", "#navbar a, .preview-box", self.navClickHandler);
		$document.on("click", "#sendBtn", self.sendEmailClickHandler);
		$window.on("hashchange", self.hashChangedHandler);
		
		$("#currentYear").text(new Date().getFullYear());
		
		$window.on("load", function () {
			// Get the tab from the url or default to the home page
			var hashObj = self.convertURLHashToObject();
			if (hashObj.t)
				self.tab = hashObj.t;
			
			// Get and save the height of each page element
			$(".markdown-body > div").each(function () {
				var $this = $(this);
				var height = $this.height();
				var $sub = $this.find(".page-sub");
				if ($sub.length)
					height += $sub.height() + 20;
				this.setAttribute("data-height", height);
				
				// Set page height to 0
				if (this.id !== self.tab)
					$this.height(0).css("display", "none");
			});
			
			self.openTab();
		});
	};

	self.hashChangedHandler = function () {
		if (self.ignoreHashChange) {
			self.ignoreHashChange = false;
			return;
		}
		var hash = self.convertURLHashToObject().t;
		self.navClickHandler({ tab: hash || "home" });
	};

	self.sendEmailClickHandler = function () {
		var subject = encodeURIComponent(document.getElementById("subject").value);
		var message = encodeURIComponent(document.getElementById("message").value);
		var address = encodeURIComponent("mailto:TheMelbournePreschool@gmail.com");
		window.open("mailto:" + address + "?subject=" + subject + "&body=" + message);
	};
	
	self.openTab = function () {
		var $newTab = $(document.getElementById(self.tab));
		
		$("#navbar a[data-tab='" + self.tab + "']").addClass("navSelected");
		
		$newTab[0].style.display = "";
		$newTab.animate({ height: Number($newTab[0].getAttribute("data-height")) }, 400);
		setTimeout(function () {
			$newTab[0].style.height = "auto";
		}, 425);
		
		if (self.tab === "contact") 
			self.insertGoogleMap();
	};
	
	self.navClickHandler = function (e) {
		var newTab = e.tab || this.getAttribute("data-tab");
		var $navBtn = $("#navbar a[data-tab=" + newTab + "]");
		var $currentNavBtn = $(".navSelected");
		
		if (newTab !== $currentNavBtn[0].getAttribute("data-tab")) {	
			$currentNavBtn.removeClass("navSelected");
			$navBtn.addClass("navSelected");
			var $currentTab = $("#" + $currentNavBtn[0].getAttribute("data-tab"));
			$currentTab.animate({ height: 0 }, 400);
			$currentTab[0].style.paddingTop = "0";
			$currentTab[0].style.paddingBottom = "0";
			
			setTimeout(function () {
				$currentTab[0].style.display = "none";
				
				setTimeout(function () {
					var $newTab = $("#" + newTab);
					$newTab[0].style.display = "";
					$newTab.animate({ height: Number($newTab[0].getAttribute("data-height")) }, 400);
					$newTab[0].style.paddingTop = "30px";
					$newTab[0].style.paddingBottom = "30px";
					
					if (newTab === "contact" && !$("iframe").length)
						self.insertGoogleMap();
						
					setTimeout(function () {
						$newTab[0].style.height = "auto";
					}, 500);
				}, 100);
			}, 400);
			
			// set the new tab in url hash in case of page refresh
			var hashObj = self.convertURLHashToObject();
			hashObj.t = newTab;
			var newHash = $.param(hashObj);
			if (!e.tab)
				self.ignoreHashChange = true;
			window.location.hash = newHash;
		}
	};
	
	self.insertGoogleMap = function () {
		var mapContent = "<br><iframe src=\"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6067.998908970787!2d-80.64315033433456!3d28.120173758600867!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88de0fd305672207%3A0xbe57a86401727ada!2sStars+Academy+Childcare+Inc!5e0!3m2!1sen!2sca!4v1458264139979\" width=\"600\" height=\"450\" frameborder=\"0\" style=\"border:0\" allowfullscreen></iframe>";
		$("#map-container").html(mapContent);
	};
	
	self.convertURLHashToObject = function () {
		var oResult = {};
		var queryString = window.location.hash;
		if (queryString) {
			var aQueryString = (queryString.substr(1)).split("&");
			for (var i = 0; i < aQueryString.length; i++) {
				var aTemp = aQueryString[i].split("=");
				if (aTemp[1].length > 0)
					oResult[aTemp[0]] = unescape(aTemp[1]);
			}
		}
		return oResult;
	};
	
	return {
		initialize: self.init,
		currentYear: self.currentYear
	};
})();

$(document).ready(function () {
	indexViewModel.initialize();
});