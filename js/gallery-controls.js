(function (window, document) {
    "use strict";

    var galleryId = 1;
    var thumbButtonSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M14.59 14.59h3.76v3.76h-3.76v-3.76zm-4.47 0h3.76v3.76h-3.76v-3.76zm-4.47 0h3.76v3.76H5.65v-3.76zm8.94-4.47h3.76v3.76h-3.76v-3.76zm-4.47 0h3.76v3.76h-3.76v-3.76zm-4.47 0h3.76v3.76H5.65v-3.76zm8.94-4.47h3.76v3.76h-3.76V5.65zm-4.47 0h3.76v3.76h-3.76V5.65zm-4.47 0h3.76v3.76H5.65V5.65z"></path></svg>';

    function fileNameToCaption(path) {
        var fileName = (path || "").split("/").pop() || "";

        return fileName
            .replace(/\.[^.]+$/, "")
            .replace(/[_-]+/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    }

    function getCaptionFromLink(link) {
        var image = link.querySelector("img");

        return link.getAttribute("data-caption") ||
            link.getAttribute("title") ||
            (image && image.getAttribute("alt")) ||
            fileNameToCaption(link.getAttribute("href"));
    }

    function shouldSkipCaption(link) {
        return link.hasAttribute("data-no-caption") ||
            (link.closest && link.closest('[data-gallery-captions="false"]'));
    }

    function prepareLink(link) {
        var image = link.querySelector("img");
        var caption = shouldSkipCaption(link) ? "" : getCaptionFromLink(link);

        if (image && !link.getAttribute("data-thumb")) {
            link.setAttribute("data-thumb", image.getAttribute("src"));
        }

        if (shouldSkipCaption(link)) {
            link.removeAttribute("data-sub-html");
            return;
        }

        if (caption && !link.getAttribute("data-sub-html")) {
            link.setAttribute("data-sub-html", caption);
        }
    }

    function getThumbSrc(core, item, index) {
        if (core.s.dynamic) {
            return core.s.dynamicEl[index].thumb || core.s.dynamicEl[index].src;
        }

        var image = item.querySelector("img");

        return item.getAttribute("data-thumb") ||
            (image && image.getAttribute("src")) ||
            item.getAttribute("href") ||
            item.getAttribute("data-src");
    }

    function updateActiveThumb(outer, index) {
        var thumbs = outer.querySelectorAll(".lg-fancybox-thumbs .fancybox-thumbs__list a");

        thumbs.forEach(function (thumb, thumbIndex) {
            thumb.classList.toggle("fancybox-thumbs-active", thumbIndex === index);
        });
    }

    function attachThumbnailButton(galleryElement) {
        var uid = galleryElement.getAttribute("lg-uid");
        var core = uid && window.lgData ? window.lgData[uid] : null;

        if (!core || !core.outer || core.items.length < 2) {
            return;
        }

        var outer = core.outer;
        var toolbar = outer.querySelector(".lg-toolbar");

        if (!toolbar || toolbar.querySelector(".lg-fancybox-thumb-toggle")) {
            return;
        }

        var button = document.createElement("button");
        button.type = "button";
        button.className = "lg-fancybox-thumb-toggle fancybox-button fancybox-button--thumbs";
        button.title = "Thumbnail";
        button.setAttribute("aria-label", "Tampilkan thumbnail");
        button.innerHTML = thumbButtonSvg;

        var thumbPanel = document.createElement("div");
        thumbPanel.className = "lg-fancybox-thumbs fancybox-thumbs fancybox-thumbs-x";

        var thumbList = document.createElement("div");
        thumbList.className = "fancybox-thumbs__list";

        Array.from(core.items).forEach(function (item, index) {
            var thumb = document.createElement("a");
            var src = getThumbSrc(core, item, index);

            thumb.href = "#";
            thumb.style.backgroundImage = 'url("' + src + '")';
            thumb.setAttribute("aria-label", "Buka gambar " + (index + 1));

            thumb.addEventListener("click", function (event) {
                event.preventDefault();
                core.slide(index, false, true);
            });

            thumbList.appendChild(thumb);
        });

        thumbPanel.appendChild(thumbList);
        toolbar.insertBefore(button, toolbar.firstChild);
        outer.querySelector(".lg").appendChild(thumbPanel);

        button.addEventListener("click", function () {
            var isOpen = outer.classList.toggle("lg-fancybox-thumbs-open");

            button.classList.toggle("lg-fancybox-thumb-active", isOpen);
            button.setAttribute("aria-pressed", isOpen ? "true" : "false");
        });

        updateActiveThumb(outer, core.index || 0);
    }

    function initLightGallery(galleryElement, selector) {
        if (!galleryElement || !window.lightGallery) {
            return;
        }

        if (galleryElement.getAttribute("data-gallery-ready") === "true") {
            return;
        }

        galleryElement.setAttribute("data-gallery-ready", "true");

        var links = selector ? galleryElement.querySelectorAll(selector) : galleryElement.children;

        Array.from(links).forEach(function (link) {
            if (link.matches && link.matches("a[href]")) {
                prepareLink(link);
            }
        });

        galleryElement.addEventListener("onAfterOpen", function () {
            attachThumbnailButton(galleryElement);
        });

        galleryElement.addEventListener("onAfterSlide", function (event) {
            var uid = galleryElement.getAttribute("lg-uid");
            var core = uid && window.lgData ? window.lgData[uid] : null;

            if (core && core.outer) {
                updateActiveThumb(core.outer, event.detail.index);
            }
        });

        window.lightGallery(galleryElement, {
            selector: selector || "a",
            galleryId: galleryId++,
            getCaptionFromTitleOrAlt: false
        });
    }

    function buildCertificateGallery() {
        var wrapper = document.querySelector(".gambar_sertifikat");
        var images = wrapper ? Array.from(wrapper.querySelectorAll(".slides img")) : [];

        if (!wrapper || !images.length) {
            return;
        }

        var hiddenGallery = document.createElement("div");
        hiddenGallery.className = "certificate-lightgallery";

        images.forEach(function (image, index) {
            var src = image.getAttribute("data-full") || image.getAttribute("src");
            var thumb = image.getAttribute("data-thumb") || image.getAttribute("src");
            var link = document.createElement("a");

            link.href = src;
            link.setAttribute("data-thumb", thumb);
            link.setAttribute("data-no-caption", "true");
            hiddenGallery.appendChild(link);

            image.setAttribute("role", "button");
            image.setAttribute("tabindex", "0");
            image.setAttribute("title", "Lihat sertifikat");

            image.addEventListener("click", function () {
                hiddenGallery.children[index].click();
            });

            image.addEventListener("keydown", function (event) {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    hiddenGallery.children[index].click();
                }
            });
        });

        wrapper.appendChild(hiddenGallery);
        initLightGallery(hiddenGallery, "a");
    }

    function initGalleryControls() {
        initLightGallery(document.getElementById("lightgallery"), "a");
        initLightGallery(document.querySelector(".imglist"), "a[href]");
        initLightGallery(document.querySelector(".tmp-pengalaman"), '.pt a[href][data-fancybox="pengalaman"]');
        buildCertificateGallery();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initGalleryControls);
    } else {
        initGalleryControls();
    }
})(window, document);
