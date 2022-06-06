"use strict";

let estados = [];
let item = null;
let estadoInicial = null;
let estadoAtual = null;
let estadosPorId = {};
let mudando = false;

function ajustarUI() {
	let html = "";

	if (estadoAtual.descricao) {
		html += `<p>${encode(estadoAtual.descricao)}</p>`;
	}

	main.style.backgroundImage = "url(/public/img/estados/" + estadoAtual.id + ".jpg?" + estadoAtual.versao + ")";
	main.innerHTML = html;
}

function irParaEstado(id) {
	if (mudando)
		return;

	let novoEstado = estadosPorId[id];
	if (!novoEstado) {
		alert("Estado " + id + " não encontrado!");
		return;
	}

	mudando = true;

	cover.className = "fade";
	document.body.appendChild(cover);

	setTimeout(function () {
		cover.className = "fade visible";

		setTimeout(function () {
			estadoAtual = novoEstado;

			ajustarUI();

			setTimeout(function () {
				cover.className = "fade";
		
				setTimeout(function () {
					mudando = false;

					document.body.removeChild(cover);
				}, 750);
			}, 50);
		}, 750);
	}, 50);
}

main.onclick = function () {
	if (mudando || !estadoAtual || !estadoAtual.idestado1 || estadoAtual.idestado2 || estadoAtual.idestado3 || estadoAtual.idestado4 || estadoAtual.idestado5)
		return;

	irParaEstado(estadoAtual.idestado1);
};

function iniciar() {
	// Criar um dicionário (hashtable)
	for (let i = 0; i < estados.length; i++) {
		const estado = estados[i];

		if (estado.inicial) {
			estadoInicial = estado;
		}

		estadosPorId[estado.id] = estado;
	}

	if (!estadoInicial) {
		alert("Não existe um estado inicial!");
		return;
	}

	for (let i = 0; i < estados.length; i++) {
		const estado = estados[i];

		if (estado.idestado1 && !estadosPorId[estado.idestado1]) {
			alert("Opção 1 do estado \"" + estado.titulo + "\" não existe!");
			return;
		}

		if (estado.idestado2 && !estadosPorId[estado.idestado2]) {
			alert("Opção 2 do estado \"" + estado.titulo + "\" não existe!");
			return;
		}

		if (estado.idestado3 && !estadosPorId[estado.idestado3]) {
			alert("Opção 3 do estado \"" + estado.titulo + "\" não existe!");
			return;
		}

		if (estado.idestado4 && !estadosPorId[estado.idestado4]) {
			alert("Opção 4 do estado \"" + estado.titulo + "\" não existe!");
			return;
		}

		if (estado.idestado5 && !estadosPorId[estado.idestado5]) {
			alert("Opção 5 do estado \"" + estado.titulo + "\" não existe!");
			return;
		}
	}

	estadoAtual = estadoInicial;

	ajustarUI();
}
