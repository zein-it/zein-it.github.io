(function (document) {
    "use strict";

    var monthMap = {
        jan: 0,
        januari: 0,
        feb: 1,
        februari: 1,
        mar: 2,
        maret: 2,
        apr: 3,
        april: 3,
        mei: 4,
        may: 4,
        jun: 5,
        juni: 5,
        jul: 6,
        juli: 6,
        agu: 7,
        ags: 7,
        aug: 7,
        agustus: 7,
        sep: 8,
        september: 8,
        okt: 9,
        oktober: 9,
        nov: 10,
        november: 10,
        des: 11,
        desember: 11,
        dec: 11
    };

    function updateAge(today) {
        var ageElement = document.querySelector("[data-birth-date]");

        if (!ageElement) {
            return;
        }

        var parts = ageElement.getAttribute("data-birth-date").split("-").map(Number);
        var birthYear = parts[0];
        var birthMonth = parts[1] - 1;
        var birthDay = parts[2];
        var birthdayThisYear = new Date(today.getFullYear(), birthMonth, birthDay);
        var age = today.getFullYear() - birthYear;

        if (today < birthdayThisYear) {
            age -= 1;
        }

        ageElement.textContent = age;
    }

    function parseMonthYear(value, today) {
        var normalized = value.trim().toLowerCase();

        if (normalized === "sekarang") {
            return {
                year: today.getFullYear(),
                month: today.getMonth()
            };
        }

        var match = normalized.match(/^([a-z]+)\s+(\d{4})$/);

        if (!match || monthMap[match[1]] === undefined) {
            return null;
        }

        return {
            year: Number(match[2]),
            month: monthMap[match[1]]
        };
    }

    function monthsInRange(rangeText, today) {
        var parts = rangeText.split(/\s*-\s*/);

        if (parts.length !== 2) {
            return 0;
        }

        var start = parseMonthYear(parts[0], today);
        var end = parseMonthYear(parts[1], today);

        if (!start || !end) {
            return 0;
        }

        var totalMonths = ((end.year - start.year) * 12) + (end.month - start.month) + 1;
        return Math.max(0, totalMonths);
    }

    function updateExperience(today) {
        var experienceElement = document.querySelector("[data-experience-total]");

        if (!experienceElement) {
            return;
        }

        var rangeElements = Array.from(document.querySelectorAll("[data-experience-range]"));

        if (!rangeElements.length) {
            rangeElements = Array.from(document.querySelectorAll(".tmp-pengalaman .pengalaman .pt p:first-child .nama3"));
        }

        var totalMonths = rangeElements.reduce(function (sum, element) {
            return sum + monthsInRange(element.textContent, today);
        }, 0);

        if (totalMonths > 0) {
            experienceElement.textContent = Math.ceil(totalMonths / 12);
        }
    }

    document.addEventListener("DOMContentLoaded", function () {
        var today = new Date();

        updateAge(today);
        updateExperience(today);
    });
})(document);
