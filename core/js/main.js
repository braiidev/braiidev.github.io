// 1- Escuchar clicks en botones existentes 
const $ = x => document.querySelector(x);

const $navigationButtons = $('#navigation');
const $index = $('#index');

function search(pattern, element){
	if(element.getAttribute(pattern)) return element;
	else return search(pattern, element.parentElement);
}
function deactive($element, force){
	for(const $btn of $navigationButtons.children){
		$btn.classList.remove('active');
		if($element && $btn === $element) $btn.classList.add('active');
		if(force && force === $btn.getAttribute('spalink')) $btn.classList.add('active');
	}
}

$navigationButtons.addEventListener('click', e => {
	const { target } = e;
	const $element = search('spalink', target);
	window.location.hash = $element.getAttribute('spalink');
	// deactive($element);
});

addEventListener('hashchange', e => {
	const route = window.location.hash.replace('#','');
	console.log('Change route to: ', route)
	if(route === "index" || route === ''){
		$index.classList.remove('minimize');
		deactive();
	}
	else {
		$index.classList.add('minimize');
		deactive(undefined, route);
	}
})

addEventListener("DOMContentLoaded", e => {
	const route = (window.location.hash)
	if(route === '') window.location.hash = "#index";
	else if(route !== "#index"){
		window.location.hash = "";
		window.location.hash = route;
		deactive(undefined,route.replace('#',''));
	}
})