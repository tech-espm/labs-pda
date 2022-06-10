"use strict";

let estados = [];
let item = null;
let estadoInicial = null;
let estadoAtual = null;
let estadosPorId = {};
let mudando = false;

function delay(intervalo) {
	return new Promise(resolve => setTimeout(resolve, intervalo));
}

function ajustarUI() {
	let html = "";
	
	if (estadoAtual.descricao) {
		html += `<p>${encode(estadoAtual.descricao)}</p>`;
	}

	if ((estadoAtual.texto1 && estadoAtual.id != estadoAtual.idestado1 && estadoAtual.texto2) ||
		estadoAtual.texto2 || estadoAtual.texto3 || estadoAtual.texto4 || estadoAtual.texto5) {

		html += `<div id="opcoes" class="opcoes">`;

		if (estadoAtual.texto1 && estadoAtual.id != estadoAtual.idestado1 && estadoAtual.texto2) {
			html += `<p><button style="pointer-events: none;" class="btn-opcao" onclick="irParaEstado(estadoAtual.idestado1)">${encode(estadoAtual.texto1)}</button></p>`;
		}

		if (estadoAtual.texto2) {
			html += `<p><button style="pointer-events: none;" class="btn-opcao" onclick="irParaEstado(estadoAtual.idestado2)">${encode(estadoAtual.texto2)}</button></p>`;
		}

		if (estadoAtual.texto3) {
			html += `<p><button style="pointer-events: none;" class="btn-opcao" onclick="irParaEstado(estadoAtual.idestado3)">${encode(estadoAtual.texto3)}</button></p>`;
		}

		if (estadoAtual.texto4) {
			html += `<p><button style="pointer-events: none;" class="btn-opcao" onclick="irParaEstado(estadoAtual.idestado4)">${encode(estadoAtual.texto4)}</button></p>`;
		}

		if (estadoAtual.texto5) {
			html += `<p><button style="pointer-events: none;" class="btn-opcao" onclick="irParaEstado(estadoAtual.idestado5)">${encode(estadoAtual.texto5)}</button></p>`;
		}

		html += `</div>`;
	}

	main.style.backgroundImage = "url(/public/img/estados/" + estadoAtual.id + ".jpg?" + estadoAtual.versao + ")";
	main.innerHTML = html;
}

async function irParaEstado(id) {
	if (mudando)
		return;

	let novoEstado = estadosPorId[id];
	if (!novoEstado) {
		alert("Estado " + id + " não encontrado!");
		return;
	}

	mudando = true;

	let opcoes = document.getElementById("opcoes");

	if (estadoAtual) {
		if (opcoes) {
			const botoes = opcoes.getElementsByTagName("button");
			if (botoes && botoes.length) {
				for (let i = 0; i < botoes.length; i++) {
					botoes[i].style.pointerEvents = "";
				}

				for (let i = botoes.length - 1; i >= 0; i--) {
					botoes[i].classList.remove("visible");
					await delay(100);
				}

				await delay(250);
			}
		}
	
		cover.className = "fade";
		document.body.appendChild(cover);

		await delay(50);

		cover.className = "fade visible";

		await delay(750);
	}

	// Aqui, o cover está 100% visível, cobrindo tudo

	estadoAtual = novoEstado;

	ajustarUI();

	opcoes = document.getElementById("opcoes");

	await delay(50);

	cover.className = "fade";

	await delay(750);

	if (opcoes) {
		const botoes = opcoes.getElementsByTagName("button");
		if (botoes && botoes.length) {
			for (let i = 0; i < botoes.length; i++) {
				botoes[i].classList.add("visible");
				await delay(100);
			}

			await delay(250);

			for (let i = 0; i < botoes.length; i++) {
				botoes[i].style.pointerEvents = "";
			}
		}
	}

	mudando = false;

	document.body.removeChild(cover);
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

	irParaEstado(estadoInicial.id);
}
