// const shrink_btn = document.querySelector(".shrink-btn");
// const sidebar_links = document.querySelectorAll(".sidebar-links a");
// const active_tab = document.querySelector(".active-tab");
// const shortcuts = document.querySelector(".sidebar-links h4");
// const tooltip_element = document.querySelectorAll(".tooltip-element");


// let activeIndex;

// shrink_btn.addEventListener("click", () => {
//     document.body.classList.toggle("shrink");
//     setTimeout(moveActiveTab, 400);

//     shrink_btn.classList.add("hovered");


//     setTimeout(() => {
//         shrink_btn.classList.remove("hovered");
//     }, 500);
// });

// function showTooltip() {
//     let tooltip = this.parentNode.lastElementChild;
//     let spans = tooltip.children;
//     let tooltipIndex = this.dataset.tooltip;

//     Array.from(spans).forEach((sp) => sp.classList.remove("show"));
//     spans[tooltipIndex].classList.add("show");

//     tooltip.style.top = `${(100 / (spans.length * 2)) * (tooltipIndex * 2 + 1)}%`;
// }

// tooltip_element.forEach((elem) => {
//     elem.addEventListener("mouseover", showTooltip);
// });



const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');

allSideMenu.forEach(item => {
    const li = item.parentElement;

    item.addEventListener('click', function () {
        allSideMenu.forEach(i => {
            i.parentElement.classList.remove('active');
        });

        li.classList.add('active');
    });
});


//Toggle sidebar

const menuBar = document.querySelector('#content nav .bx.bx-menu');
const sidebar = document.getElementById('sidebar');

menuBar.addEventListener('click', function () {
    sidebar.classList.toggle('hide');
});


if(window.innerWidth < 768){
    sidebar.classList.add('hide');
}