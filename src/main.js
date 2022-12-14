import "./css/index.css";
import IMask from "imask";

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path");
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path");
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img");

const setCardType = (type) => {
    const colors = {
        visa: ["#436d99", "#2d57f2"],
        mastercard: ["#df6f29", "#c69347"],
        default: ["black", "gray"]
    };

    ccBgColor01.setAttribute("fill", colors[type][0]);
    ccBgColor02.setAttribute("fill", colors[type][1]);

    ccLogo.setAttribute("src", `cc-${type}.svg`);
}

globalThis.setCardType = setCardType;

const securityCode = document.getElementById("security-code");
const expDate = document.getElementById("expiration-date");
const cardNumber = document.getElementById("card-number");

const securityCodePattern = {
    mask: "0000",
}

const expDatePattern = {
    mask: "MM{/}YY",
    blocks: {
        MM: {
            mask: IMask.MaskedRange,
            from: 1,
            to: 12
        },
        YY: {
            mask: IMask.MaskedRange,
            from: String(new Date().getFullYear()).slice(2),
            to: String(new Date().getFullYear() + 10).slice(2),
        }
    }
}

const cardNumberPattern = {
    mask: [
        {
            mask: "0000 0000 0000 0000",
            regex: /^4\d{0,15}/,
            cardtype: "visa",
        },

        {
            mask: "0000 0000 0000 0000",
            regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
            cardtype: "mastercard",
        },

        {
            mask: "0000 0000 0000 0000",
            cardtype: "default",
        },
    ],
    dispatch: function (appended, dynamicMasked) {
        const number = (dynamicMasked.value + appended).replace(/\D/g, "");

        const foundMask = dynamicMasked.compiledMasks.find(item => number.match(item.regex));
    
        return foundMask;
    }
}

const securityCodeMask = IMask(securityCode, securityCodePattern);
const expDateMask = IMask(expDate, expDatePattern);
const cardNumberMask = IMask(cardNumber, cardNumberPattern);

document.querySelector("form").addEventListener("submit", event => event.preventDefault());

const addButton = document.getElementById("add-card");
addButton.addEventListener("click", () => {
    alert("Card added");
});

const cardHolder = document.querySelector("#card-holder");

cardHolder.addEventListener("input", () => {
    const ccHolder = document.querySelector(".cc-holder .value");

    ccHolder.innerText = cardHolder.value.length === 0 ? "NAME ON CARD" : cardHolder.value;
});

securityCodeMask.on("accept", () => {
    const ccSecurity = document.querySelector(".cc-security .value");
    ccSecurity.innerText = securityCodeMask.value.length === 0 ? "1234" : securityCodeMask.value;
});

cardNumberMask.on("accept", () => {
    const cardType = cardNumberMask.masked.currentMask.cardtype;

    console.log(cardType)

    setCardType(cardType);

    const ccNumber = document.querySelector(".cc-number");

    ccNumber.innerText = cardNumberMask.value.length === 0 ? "1234 5678 9037 3911" : cardNumberMask.value;
});

expDateMask.on("accept", () => {
    const ccExpiration = document.querySelector(".cc-extra .value");

    ccExpiration.innerText = expDateMask.value.length === 0 ? "02/32" : expDateMask.value;
});







