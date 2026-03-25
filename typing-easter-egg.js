const target = "STARS";
let index = 0;

let vierkant = document.querySelector('.stars-typing');

function triggerEasterEgg (){
  vierkant.classList.remove('hidden-stars');
}

document.addEventListener('keydown', (e) => {
  const key = e.key.toUpperCase();

  if (key === target[index]) {
    index++;
    if (index === target.length) {
      triggerEasterEgg();
      index = 0;
    }
  } else {
    index = key === target[0] ? 1 : 0;
  }
});