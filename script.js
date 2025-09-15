import * as Ton from "https://esm.sh/@ton/ton@latest";
import { Address } from "https://esm.sh/@ton/core";
const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
    manifestUrl: 'https://raw.githubusercontent.com/hamstermod/forton.github.io/refs/heads/main/manifest.json',
});
const container = document.querySelector('.last-100-circles');
const diamondsChild = document.getElementById('diamondsChild');
const backdropBlur = document.getElementById('backdropBlur');
const walletElm = document.getElementById('wallet');
const buttonWallet = document.getElementById('buttonWallet');
const closeWalletElm = document.getElementById('closeWallet');
const closeDepositElm = document.getElementById('closeDeposit');
const openWithdrawPopup = document.getElementById('openWithdrawPopup');
const openDepositPopup = document.getElementById('openDepositPopup');
const popupText = document.querySelectorAll('.popupText');
const popup = document.getElementById('popup');
const disconnectWallet = document.getElementById('disconnectWallet');
const addressText = document.getElementById('addressText');
const minBut = document.getElementById('minBut');
const halfBut = document.getElementById('halfBut');
const x2But = document.getElementById('x2But');
const depositBtn = document.querySelector('.deposit-btn');
const progressElm = document.getElementById('progress');
const progressText = document.getElementById('progressText');
const inputDepositOrWithdraw = document.getElementById('amount');
const [blueBetParent, greenBetParent, redBetParent] = document.querySelectorAll(".userBetDiv");
const colors = ['blue', 'red', 'blue', 'red', 'blue', 'red', 'green'];
const totalDiamonds = 28; // всего элементов
let userUIdata = {
    user: {
        id :1
    }
}
// const diamondsChild = document.getElementById('diamondsChild');
const diamondsElms = [];
for (let i = 0; i < totalDiamonds; i++) {
    const diamondParent = document.createElement('div');
    const diamond = document.createElement('div');
    const diamondWinAnim = document.createElement('div');

    diamond.classList.add('diamond');

    const color = colors[i % colors.length];
    diamond.classList.add(color);
    diamondWinAnim.className = `${color} winDiamond diamond2 hide`
    diamondWinAnim.style.animationPlayState = "paused"
    diamondParent.classList.add("fuckingParentOfDiamond")
    diamondParent.appendChild(diamondWinAnim);
    diamondParent.appendChild(diamond);
    diamondsChild.appendChild(diamondParent);
    diamondsElms.push(diamondParent);
}

function addNewCircle(color) {
    const circle = document.createElement('div');
    circle.classList.add('circle', color);

    container.appendChild(circle); // добавляем новый кружок справа

    // Если больше 20 кружков — удаляем первый
    if (container.children.length > 5) {
        container.removeChild(container.firstElementChild);
    }
}
function addUser(color, userData){
    const elm = document.createElement('div');
    const img = document.createElement('img');
    img.src = userData.img;
    img.classList.add("profileImg");
    elm.classList.add("cardBet");
    elm.appendChild(img);
    const card2 = document.createElement('div');
    const username = document.createElement('div');
    const balanceBet = document.createElement('div');
    const tonImg = document.createElement('img');
    const tonAmount = document.createElement('span');
    tonImg.classList.add('tonIcon');
    tonImg.src = "./images/tonIcon.png";
    tonAmount.innerText = userData.ton;
    balanceBet.classList.add("balanceBet");
    balanceBet.appendChild(tonImg);
    balanceBet.appendChild(tonAmount);

    username.classList.add('username');
    username.innerText = userData.username.length > 5 ?  userData.username.slice(0, 4) + '..' : userData.username;
    card2.classList.add('card2');
    card2.appendChild(username);
    card2.appendChild(balanceBet);
    elm.appendChild(card2);

    if(color === "blue"){
        blueBetParent.appendChild(elm);
        return;
    }
    if(color === "green"){
        greenBetParent.appendChild(elm);
        return;
    }
    redBetParent.appendChild(elm);

}
addUser("green", {username: "Hayk", ton: 21, img: "https://tonroll.com/static/media/userAvatar.c95e03b5dd1c0de60788.png"});
function toNano(amount) {
    const parts = amount.toString().split('.');
    let nanoStr = parts[0] + (parts[1] ? parts[1].padEnd(9, '0').slice(0, 9) : '000000000');
    nanoStr = nanoStr.replace(/^0+/, '') || '0';
    return nanoStr;
}
const colorsProgress = [
    { percent: 100, color: "#28c76f" },
    { percent: 80,  color: "#55efc4" },
    { percent: 60,  color: "#f1c40f" },
    { percent: 40,  color: "#e67e22" },
    { percent: 20,  color: "#e74c3c" },
    { percent: 0,   color: "#c0392b" }
];
function showToast(type, message) {
    const container = document.getElementById('toast-container');

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let icon = '';
    switch(type) {
        case 'error': icon = '❌'; break;
        case 'warning': icon = '⚠️'; break;
        case 'info': icon = 'ℹ️'; break;
        case 'success': icon = '✅'; break;
    }

    toast.innerHTML = `
    <span class="iconToast">${icon}</span>
    <span style="flex:1">${message}</span>
    <button class="close-btnToast">×</button>
  `;

    toast.querySelector(".close-btnToast").addEventListener("click", () => {
        closeToast(toast);
    });

    container.appendChild(toast);

    setTimeout(() => {
        closeToast(toast);
    }, 5000);
}
// showToast("success", "hi");
function closeToast(toast) {
    toast.style.animation = "fadeOut 0.3s ease forwards";
    setTimeout(() => toast.remove(), 300);
}
function getColorForPercent(p) {
    for (let i = 0; i < colorsProgress.length - 1; i++) {
        const c1 = colorsProgress[i];
        const c2 = colorsProgress[i + 1];
        if (p <= c1.percent && p >= c2.percent) {
            // интерполяция
            const range = c1.percent - c2.percent;
            const t = (p - c2.percent) / range;
            return interpolateColor(c2.color, c1.color, t);
        }
    }
    return colors[colors.length - 1].color;
}

function interpolateColor(color1, color2, factor) {
    let c1 = hexToRgb(color1);
    let c2 = hexToRgb(color2);
    let r = Math.round(c1.r + (c2.r - c1.r) * factor);
    let g = Math.round(c1.g + (c2.g - c1.g) * factor);
    let b = Math.round(c1.b + (c2.b - c1.b) * factor);
    return `rgb(${r},${g},${b})`;
}

function hexToRgb(hex) {
    let bigint = parseInt(hex.slice(1), 16);
    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255
    };
}

function setTimer(timeLeft) {

    let duration = 15;
    const interval = setInterval(() => {
        timeLeft -= 0.01;
        const text =  timeLeft.toFixed(2);
        progressText.innerText = "ROLLING IN " + (text.length < 5 ? "0" : '') + text;

        let percent = (timeLeft / duration) * 100;
        progressElm.style.width = percent + "%";

        progressElm.style.background = getColorForPercent(percent);

        if (timeLeft <= 0) {
            clearInterval(interval);
            progressText.innerText = "ROLLING...";
            progressElm.style.width = "0%";
            progressElm.style.background = "#c0392b";
        }
    }, 10);
}
setTimer(15)
function spin(i, started, color) {
    const totalDuration = 3;
    const delay = (new Date() - started) / 1000;
    const remaining = totalDuration - delay;
    i += 17;
    i-=3;
    progressElm.style.width = "0";
    progressElm.style.transition = "0s";
    progressText.innerText = "ROLLING...";

    const targetLeft = -(i * 60 + i * 10);
    if (delay >= totalDuration) {
        diamondsChild.style.transition = "0s";
        diamondsChild.style.left = `${targetLeft}px`;
    } else {
        diamondsChild.style.transition = "0s";
        const progress = delay / totalDuration;
        const startLeft = 0;
        const currentLeft = startLeft + (targetLeft - startLeft) * progress;

        diamondsChild.style.left = `${currentLeft}px`;
        setTimeout(() => {
            diamondsChild.style.transition = `${remaining}s cubic-bezier(0.1, 0.75, 0.73, 1.09)`;
            diamondsChild.style.left = `${targetLeft}px`;


            setTimeout(() => {
                const parent = diamondsElms[i+2];
                const child1 = diamondsElms[i+2].childNodes[0];
                const child2 = diamondsElms[i+2].childNodes[1];

                parent.style.transform = "scale(1.2)";

                parent.classList.add("fullChild");
                diamondsChild.classList.add("disabledAllEffect");

                blueBetParent.classList.add("disabledEffect");
                redBetParent.classList.add("disabledEffect");
                greenBetParent.classList.add("disabledEffect");
                if(color === "blue"){
                    blueBetParent.classList.remove("disabledEffect");

                } else if(color === "red"){
                    redBetParent.classList.remove("disabledEffect");
                }
                else{
                    greenBetParent.classList.remove("disabledEffect");
                }

                setTimeout(() => {
                    child1.classList.remove("hide");
                    child1.style.animationPlayState = "running";
                    child2.classList.add("hide");
                    addNewCircle(color);
                    //TODO
                    progressElm.style.width = "100%";
                    // progressElm.style.backgroundColor = color;
                    progressElm.classList.add(color)//= color;
                    progressText.innerText = `WIN ${color.toUpperCase()}`;
                    // progress.style.transition = "0s";



                    setTimeout(() => {
                        child1.classList.add("hide");
                        child2.classList.remove("hide");

                       setTimeout(() => {

                           child1.style.animationPlayState = "paused";

                           setTimeout(() => {
                               parent.style.transform = "scale(1)";
                               diamondsChild.classList.remove("disabledAllEffect")
                               parent.classList.remove("fullChild");
                               progressElm.classList.remove(color);
                               progressElm.style.transition = "1s ease";
                           }, 500)
                       }, 700)
                    }, 3300)
                }, 1000);
            }, remaining * 1000)
        }, 50);

    }
}
const a = new Date();
// spin(2, a, "blue");
// setInterval(() => {
//     spin(2, a)
// }, 2000)
function getWalletAddress(){
    const raw = tonConnectUI.wallet.account.address;

    const friendly = Address.parse(raw).toString({
        bounceable: false,
        urlSafe: true
    });
    return friendly;
}
function closeWallet(){
    backdropBlur.classList.add('hide')
    walletElm.classList.remove("opened")
}
backdropBlur.onclick = closeWallet;
closeWalletElm.onclick = closeWallet;
buttonWallet.onclick = async  () => {
    if (!tonConnectUI.wallet) {
        await tonConnectUI.openModal();
        return;
    }
    const address = getWalletAddress();
    addressText.innerText = address.slice(0, 4) + "..." + address.slice(-4);
    backdropBlur.classList.remove('hide')
    walletElm.classList.add("opened")
}
function openPopup(popupType= 0) { //0 deposit 1 withdraw
    popupText.forEach(e => {
        e.innerText = popupType ? "Withdraw" : "Deposit";
    })
    if(popupType){

    } else{
        depositBtn.onclick = async function () {
            if (!tonConnectUI.connected) {
                await tonConnectUI.connectWallet();
                if (!tonConnectUI.connected) return;
            }

            const amountInput = parseFloat(inputDepositOrWithdraw.value);
            if (isNaN(amountInput) || amountInput < 0.01) {
                showToast("info", "Minimum deposit is 0.01 TON. Please enter a valid amount.");
                return;
            }

            const userID = userUIdata.user.id + '';

            const commentBody = Ton.beginCell()
                .storeUint(0, 32)
                .storeStringTail(userID)
                .endCell();

            const payloadBoc = commentBody.toBoc();
            const base64Payload = btoa(String.fromCharCode(...payloadBoc));

            const transaction = {
                validUntil: Math.floor(Date.now() / 1000) + 360,
                messages: [
                    {
                        address: "UQBpItfW2j2WG5KXU4kfDqLU3hyBzKNl-DoIAmTRcl_7FXiM",
                        amount: toNano(amountInput),
                        payload: base64Payload
                    }
                ]
            }

            try{
                const result = await tonConnectUI.sendTransaction(transaction);
                showToast("success", "Payment successful.\n Your deposit will be processed within 5 to 60 seconds.");
                // closeDepositPage1.classList.add('hide');
                // for(let i = 0; i < 10; i++){
                //     setTimeout(() => {
                //         socket.emit("deposit");
                //         socket.emit("auth");
                //     }, 2000 * i)
                // }
            }catch(e){
                showToast("error", "Payment rejected.\nSomething went wrong. Please try again later.");
            }

        }
    }
    popup.style.display = "flex";
}
// openPopup();
function closePopup() {
    popup.style.display = "none";
}

function closeOnBackground(event) {
    if (event.target.classList.contains("popup")) {
        closePopup();
    }
}
popup.onclick = closeOnBackground;
closeDepositElm.onclick = closePopup;
openDepositPopup.onclick = () => {
    openPopup(0);
}
openWithdrawPopup.onclick = () => {
    openPopup(1);
}
disconnectWallet.onclick = () => {
    tonConnectUI.disconnect();
    closeWallet();
}
minBut.onclick = () => {
    inputGameBet.value = 0.01;
}
halfBut.onclick = () => {
    inputGameBet.value = Math.max(0.01, inputGameBet.value / 2);
}
x2But.onclick = () => {
    inputGameBet.value =Math.min( Math.max(0.01, inputGameBet.value * 2), 100000);
}
inputGameBet.addEventListener('input', (e) => {
    // let value = parseFloat(inputGameBet.value);
    if(e.target.value.length === 0){
        e.target.value = 0.01;
    }
    // console.log(e.target.value)
    if(e.target.value.indexOf("-") !== -1){
        e.target.value = e.target.value.replaceAll("-", "");
    }

});
// setInterval(() => {
//     const colors = ['red', 'blue', 'green'];
//     const randomColor = colors[Math.floor(Math.random() * colors.length)];
//     addNewCircle(randomColor);
// }, 1500);