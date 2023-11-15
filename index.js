"use strict";

let USERS = [
  {
    firstName: "Boyqul",
    lastName: "Abdullayev",
    username: "boyqulabdullayev",
    password: "Boyqul2008",
    card: {
      cardType: "VISA",
      balans: 16000000,
      fullName: "Boyqul Abdullayev ",
      cardNumber: 1234_5678_9123_4567,
      expiredDate: "02/12",
      transfers: [],
    },
  },
  {
    firstName: "Asliddin",
    lastName: "CHoriyev",
    username: "asliddinchoriyev",
    password: "Asliddin2008",
    card: {
      cardType: "VISA",
      balans: 210000,
      fullName: "Asliddin Choriyev",
      cardNumber: 1234_5678_9123_1234,
      expiredDate: "03/13",
      transfers: [],
    },
  },
  {
    firstName: "Mirjalol",
    lastName: "Ashirov",
    username: "mirjalolashirov",
    password: "Mirjalol2020",
    card: {
      cardType: "Humo",
      balans: 1700000,
      fullName: "Ashirov Mirjalol",
      cardNumber: 1234_5678_9123_3452,
      expiredDate: "04/23",
      transfers: [],
    },
  },
  {
    firstName: "Asilbek",
    lastName: "Boyqobilov",
    username: "aslibekboyqobilov",
    password: "Asilbek2008",
    card: {
      cardType: "Master",
      balans: 1800000,
      fullName: "Asilbek Boyqobilov",
      cardNumber: 1234_5678_9123_6547,
      expiredDate: "04/23",
      transfers: [],
    },
  },
  {
    firstName: "Shaxboz",
    lastName: "Choriyev",
    username: "shaxbozchoriyev",
    password: "Shaxboz2006",
    card: {
      cardType: "Master",
      balans: 2300000,
      fullName: "Shaxboz Choriyev",
      cardNumber: 1234_5678_9123_1452,
      expiredDate: "06/26",
      transfers: [],
    },
  },
];

const column = [
  {
    label: "N/O",
    accessor: "i",
  },
  {
    label: "F.I",
    accessor: "card.fullName",
  },
  {
    label: "Login",
    accessor: "username",
  },
  {
    label: "Parol",
    accessor: "password",
  },
  {
    label: "Karta raqami",
    accessor: "card.cardNumber",
  },
];

let USER = null;
let isVerify = false;

//pages
const loginPage = document.querySelector(".login-page");
const paymentPage = document.querySelector(".payment-app");

// inputs
const loginInput = document.querySelector(".login-input");
const passwordInput = document.querySelector(".password-input");
const transferCardNumInput = document.querySelector(".transfer-card-num");
const transferAmountInput = document.querySelector(".transfer-amount");

// buttons
const loginButton = document.querySelector(".login-button");
const logOutButton = document.querySelector(".log-out-btn");
const transferBtn = document.querySelector(".transfer-btn");

// elements
const title = document.querySelector(".title");
const cardType = document.querySelector(".card-type");
const balans = document.querySelector(".amount");
const cardFullName = document.querySelector(".fullName");
const cardNumber = document.querySelector(".card-number");
const cardExpiredDate = document.querySelector(".card-expired-date");
const allHistory = document.querySelector(".all-history");
const allMinusHis = document.querySelector(".red");
const allPlusHis = document.querySelector(".green");
const thead = document.querySelector(".thead-tr");
const tbody = document.querySelector(".tbody");

// custom library

const formatCardNumber = (cardNum) => {
  cardNum = cardNum.toString();
  const arr = [];
  for (let i = 0; i < cardNum.length; i += 4) {
    arr.push(cardNum.slice(i, i + 4));
  }
  return arr.join(" ");
};

const writeTableInfo = () => {
  thead.innerHTML = "";
  for (let i = 0; i < column.length; i++) {
    thead.insertAdjacentHTML(
      "beforeend",
      `<th class="th">${column[i].label}</th>`
    );
  }
  USERS.forEach((u, i) => {
    tbody.insertAdjacentHTML(
      "beforebegin",
      `<tr class="tbody-tr">
        ${(function () {
          return `<td class="td">${i + 1}</td>`;
        })()}
        ${(function () {
          return `<td class="td">${u.card.fullName}</td>`;
        })()}
        ${(function () {
          return `<td class="td">${u.username}</td>`;
        })()}
      ${(function () {
        return `<td class="td">${u.password}</td>`;
      })()}
      ${(function () {
        return `<td class="td">${formatCardNumber(u.card.cardNumber)}</td>`;
      })()}
      </tr>`
    );
  });
};
writeTableInfo();

const formatCurrency = (money) => {
  return money.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const writeOfCardInfo = () => {
  cardType.textContent = USER.card.cardType;
  balans.textContent = formatCurrency(USER.card.balans);
  cardFullName.textContent = USER.card.fullName;

  cardNumber.textContent = formatCardNumber(USER.card.cardNumber);
  cardExpiredDate.textContent = USER.card.expiredDate;
  title.textContent = `Xush kelibsiz, ${USER.firstName}!`;
};

const createTrObj = (trCardNum, trAmount) => {
  const date = new Date();
  const to = USERS.filter((u) => u.card.cardNumber === +trCardNum)?.[0];
  const trObj = {
    from: `${USER?.firstName} ${USER?.lastName}`,
    to: `${to?.firstName} ${to?.lastName}`,
    amount: trAmount,
    trType: "out",
    date: `${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}.${
      +date.getMonth() + 1 < 10
        ? "0" + (+date.getMonth() + 1)
        : +date.getMonth() + 1
    }.${date.getFullYear()} ${
      date.getHours() < 10 ? "0" + date.getHours() : date.getHours()
    }:${date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()}`,
  };
  USER?.card?.transfers?.push(trObj);
  USERS?.map((u) => {
    if (u?.card?.cardNumber === +trCardNum) {
      u?.card?.transfers.push({
        from: trObj?.from,
        to: trObj?.to,
        amount: trAmount,
        date: trObj.date,
        trType: "in",
      });
      u.card.balans = u.card.balans + trAmount;
    }
    return u;
  });
};

const writeAllHistory = () => {
  const [minus, plus] = USER.card.transfers.reduce(
    (acc, tr) => {
      if (tr.trType === "out") {
        acc[0] += tr.amount;
      } else {
        acc[1] += tr.amount;
      }
      return acc;
    },
    [0, 0]
  );
  allMinusHis.textContent = `-${formatCurrency(minus)}`;
  allPlusHis.textContent = `+${formatCurrency(plus)}`;
  if (USER.card.transfers.length > 0) {
    allHistory.innerHTML = "";
    USER?.card?.transfers?.forEach((tr) => {
      const [date, hour] = tr?.date?.split(" ");
      const li = `<li class="history-item">
                  <div class="fullName">
                    <p>${tr?.trType === "out" ? tr?.to : tr?.from}</p>
                    <p class="${tr?.trType === "out" ? "red" : "green"}">${
        tr?.trType === "out" ? "-" : "+"
      }${formatCurrency(tr?.amount)}</p>
                  </div>
                  <span class="date">
                    <span>${date}</span>
                    <span>${hour}</span>
                  </span>
                </li>`;
      allHistory?.insertAdjacentHTML("afterbegin", li);
    });
  }
};

// event
loginButton.addEventListener("click", (e) => {
  e.preventDefault();
  const username = loginInput.value.trim();
  const password = passwordInput.value.trim();

  USERS.forEach((u) => {
    if (u.username === username && u.password === password) {
      USER = u;
      isVerify = true;
    }
  });
  if (!isVerify) {
    alert("Xatolik bor, Login yoki Parol xato");
    return;
  }
  loginInput.value = "";
  passwordInput.value = "";

  paymentPage.classList.remove("hidden");
  loginPage.classList.add("hidden");
  writeOfCardInfo();
  writeAllHistory();
});

transferBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const trCardNum = transferCardNumInput.value.replaceAll(/[^0-9]/g, "");
  const trAmount = Math.abs(+transferAmountInput.value);
  transferAmountInput.value = "";
  transferCardNumInput.value = "";
  if (!trCardNum || !+trCardNum) {
    alert("Karta raqamiga faqat raqam kiriting!!!");
    return;
  } else if (trCardNum.length !== 16) {
    alert("Katra raqam noto'g'ri kiritildi!!!");
    return;
  }
  if (!trAmount || trAmount < 1) {
    alert("O'tkazma summasini to'g'ri kiriting!!!");
    return;
  }
  if (trAmount > USER.card.balans) {
    alert("Xatolik yuz berdi. Hisobda mablag' yetarli emas!!!");
    return;
  }
  USER.card.balans = USER.card.balans - trAmount;
  createTrObj(trCardNum, trAmount);
  writeAllHistory();
  writeOfCardInfo();
});

logOutButton.addEventListener("click", () => {
  paymentPage.classList.add("hidden");
  loginPage.classList.remove("hidden");
  cardType.textContent = "****";
  balans.textContent = "*****";
  cardFullName.textContent = "*** ***";
  cardNumber.textContent = "**** **** **** ****";
  cardExpiredDate.textContent = "**/**";
  title.textContent = "";
  allHistory.innerHTML = "";
  USER = null;
  tbody.innerHTML = "";
});
