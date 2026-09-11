(function (window, document) {
    "use strict";

    var originalTitle = document.title;
    var titleCleared = false;
    var printImageSelector = "#lightgallery > a[href] > img, .imglist > a[href] > img";

    function clearPrintTitle() {
        if (!titleCleared) {
            originalTitle = document.title;
            titleCleared = true;
        }

        document.title = " ";
    }

    function restorePrintTitle() {
        document.title = originalTitle;
        titleCleared = false;
    }

    function getLinkedImageHref(image) {
        var link = image.parentElement;

        while (link && link.tagName !== "A") {
            link = link.parentElement;
        }

        if (!link) {
            return "";
        }

        return link.getAttribute("href") || "";
    }

    function waitForImage(image) {
        return new Promise(function (resolve) {
            var settled = false;

            function done() {
                if (settled) {
                    return;
                }

                settled = true;
                image.removeEventListener("load", done);
                image.removeEventListener("error", done);
                resolve();
            }

            if (image.complete && image.naturalWidth > 0) {
                resolve();
                return;
            }

            image.addEventListener("load", done);
            image.addEventListener("error", done);
            window.setTimeout(done, 3000);
        });
    }

    function preparePrintImages() {
        var waits = [];

        document.querySelectorAll(printImageSelector).forEach(function (image) {
            var href = getLinkedImageHref(image);

            if (!href || href.charAt(0) === "#") {
                return;
            }

            if (!image.hasAttribute("data-print-original-src")) {
                image.setAttribute("data-print-original-src", image.getAttribute("src") || "");
            }

            if (image.getAttribute("src") !== href) {
                image.setAttribute("src", href);
            }

            waits.push(waitForImage(image));
        });

        return Promise.all(waits);
    }

    function restorePrintImages() {
        document.querySelectorAll("[data-print-original-src]").forEach(function (image) {
            var originalSrc = image.getAttribute("data-print-original-src");

            if (originalSrc) {
                image.setAttribute("src", originalSrc);
            } else {
                image.removeAttribute("src");
            }

            image.removeAttribute("data-print-original-src");
        });
    }

    function finishPrint() {
        restorePrintImages();
        restorePrintTitle();
    }

    window.addEventListener("beforeprint", function () {
        clearPrintTitle();
        preparePrintImages();
    });
    window.addEventListener("afterprint", finishPrint);

    document.addEventListener("DOMContentLoaded", function () {
        document.querySelectorAll("[data-print-button]").forEach(function (button) {
            button.addEventListener("click", function (event) {
                event.preventDefault();
                clearPrintTitle();
                preparePrintImages().then(function () {
                    window.print();
                    window.setTimeout(finishPrint, 1000);
                });
            });
        });
    });
})(window, document);
