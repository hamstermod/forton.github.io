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

function addNewCircle(color) {
    const circle = document.createElement('div');
    circle.classList.add('circle', color);

    container.appendChild(circle); // добавляем новый кружок справа

    // Если больше 20 кружков — удаляем первый
    if (container.children.length > 5) {
        container.removeChild(container.firstElementChild);
    }
}

function spin(i, started) {
    const totalDuration = 3;
    const delay = (new Date() - started) / 1000;
    const remaining = totalDuration - delay;
    i += 17;
    i-=3;
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
        }, 50);
    }
}
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
// setInterval(() => {
//     const colors = ['red', 'blue', 'green'];
//     const randomColor = colors[Math.floor(Math.random() * colors.length)];
//     addNewCircle(randomColor);
// }, 1500);