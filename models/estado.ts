import app = require("teem");

interface Estado {
	id: number;
	idnarrativa: number;
	inicial: number;
	versao: number;
	titulo: string;
	descricao: string;
	idestado1: number;
	texto1: string;
	idestado2: number;
	texto2: string;
	idestado3: number;
	texto3: string;
	idestado4: number;
	texto4: string;
	idestado5: number;
	texto5: string;
}

class Estado {
	public static readonly CaminhoRelativoImagem = "public/img/estados/";
	public static readonly TamanhoMaximoImagemEmBytes = 512 * 1024;

	private static validar(estado: Estado): string {
		if (!estado)
			return "Estado inválido!";

		estado.id = parseInt(estado.id as any);

		estado.idnarrativa = parseInt(estado.idnarrativa as any);
		if (isNaN(estado.idnarrativa))
			return "Narrativa inválida";

		estado.titulo = (estado.titulo || "").normalize().trim();	
		if (estado.titulo.length < 3 || estado.titulo.length > 100)
			return "Titulo inválido";

		estado.descricao = (estado.descricao || "").normalize().trim();
		if (!estado.descricao)
			estado.descricao = null;
		else if (estado.descricao && estado.descricao.length > 10000)
			return "Descrição inválida";

		let ids = [
			parseInt(estado.idestado1 as any),
			parseInt(estado.idestado2 as any),
			parseInt(estado.idestado3 as any),
			parseInt(estado.idestado4 as any),
			parseInt(estado.idestado5 as any)
		];

		let textos = [
			(estado.texto1 || "").normalize().trim(),
			(estado.texto2 || "").normalize().trim(),
			(estado.texto3 || "").normalize().trim(),
			(estado.texto4 || "").normalize().trim(),
			(estado.texto5 || "").normalize().trim()
		];

		let preenchidos = 0;

		for (let i = textos.length - 1; i >= 0; i--) {
			if (!ids[i] && !textos[i]) {
				if (preenchidos)
					return "Destino da opção " + (i + 1) + " vazio";

				ids[i] = 0;
				textos[i] = null;
				continue;
			}

			if (isNaN(ids[i]))
				return "Destino da opção " + (i + 1) + " inválido";

			if (!textos[i]) {
				// Se só tiver a opção 1 (índice 0), o texto é opcional
				if (!preenchidos && !i)
					textos[i] = null;
				else
					return "Texto da opção " + (i + 1) + " inválido";
			} else {
				if (!ids[i])
					return "Destino da opção " + (i + 1) + " inválido";

				if (textos[i].length > 100)
					return "Texto da opção " + (i + 1) + " inválido";
			}

			preenchidos++;
		}

		estado.idestado1 = ids[0];
		estado.idestado2 = ids[1];
		estado.idestado3 = ids[2];
		estado.idestado4 = ids[3];
		estado.idestado5 = ids[4];

		estado.texto1 = textos[0];
		estado.texto2 = textos[1];
		estado.texto3 = textos[2];
		estado.texto4 = textos[3];
		estado.texto5 = textos[4];

		return null;
	}

	public static listar(idnarrativa: number, idusuario: number, admin: boolean): Promise<Estado[]> {
		return app.sql.connect(async (sql) => {
			if (admin)
				return (await sql.query("select id, idnarrativa, inicial, versao, titulo, descricao, idestado1, texto1, idestado2, texto2, idestado3, texto3, idestado4, texto4, idestado5, texto5 from estado where idnarrativa = ? order by id asc", [idnarrativa])) as Estado[] || [];
			else
				return (await sql.query("select e.id, e.idnarrativa, e.inicial, e.versao, e.titulo, e.idestado1, e.texto1, e.idestado2, e.texto2, e.idestado3, e.texto3, e.idestado4, e.texto4, e.idestado5, e.texto5 from narrativa n inner join estado e on e.idnarrativa = n.id where n.id = ? and n.idusuario = ? order by e.id asc", [idnarrativa, idusuario])) as Estado[] || [];
		});
	}

	public static obter(id: number, idnarrativa: number, idusuario: number, admin: boolean): Promise<Estado> {
		return app.sql.connect(async (sql) => {
			let lista : Estado[];
			if (admin)
				lista = (await sql.query("select id, idnarrativa, inicial, versao, titulo, descricao, idestado1, texto1, idestado2, texto2, idestado3, texto3, idestado4, texto4, idestado5, texto5 from estado where id = ? and idnarrativa = ?", [id, idnarrativa])) as Estado[] || [];
			else
				lista = (await sql.query("select e.id, e.idnarrativa, e.inicial, e.versao, e.titulo, e.idestado1, e.texto1, e.idestado2, e.texto2, e.idestado3, e.texto3, e.idestado4, e.texto4, e.idestado5, e.texto5 from narrativa n inner join estado e on e.idnarrativa = n.id where e.id = ? and n.id = ? and n.idusuario = ?", [id, idnarrativa, idusuario])) as Estado[] || [];
			return (lista && lista[0]) || null;
		});
	}

	public static criar(estado: Estado, imagem: app.UploadedFile, idusuario: number, admin: boolean): Promise<number | string> {
		const erro = Estado.validar(estado);
		if (erro)
			return Promise.resolve(erro);

		if (!imagem)
			return Promise.resolve("Imagem inválida!");

		if (imagem.size > Estado.TamanhoMaximoImagemEmBytes)
			return Promise.resolve("A imagem deve ter, no máximo, " + Estado.TamanhoMaximoImagemEmBytes + " bytes");

		return app.sql.connect(async (sql) => {
			if (!admin) {
				const i = await sql.scalar("select id from narrativa where id = ? and idusuario = ?", [estado.idnarrativa, idusuario]);
				if (!i)
					return "Narrativa não encontrada";
			}

			await sql.beginTransaction();

			try {
				await sql.query("insert into estado (idnarrativa, inicial, versao, titulo, descricao, idestado1, texto1, idestado2, texto2, idestado3, texto3, idestado4, texto4, idestado5, texto5) values (?, 0, 0, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)" , [estado.idnarrativa, estado.titulo, estado.descricao, estado.idestado1, estado.texto1,estado.idestado2, estado.texto2, estado.idestado3, estado.texto3,estado.idestado4,estado.texto4, estado.idestado5, estado.texto5]);
			} catch (e: any) {
				if (e.code) {
					switch (e.code) {
						case "ER_DUP_ENTRY":
							return "Já existe um estado com este título nesta narrativa";
						default:
							throw e;
					}
				} else {
					throw e;
				}
			}

			estado.id = await sql.scalar("select last_insert_id()");

			await app.fileSystem.saveUploadedFile(Estado.CaminhoRelativoImagem + estado.id + ".jpg", imagem);

			await sql.commit();

			return estado.id;
		});
	}

	public static editar(estado: Estado, imagem: app.UploadedFile, idusuario: number, admin: boolean): Promise<string> {
		const erro = Estado.validar(estado);
		if (erro)
			return Promise.resolve(erro);

		if (imagem && imagem.size > Estado.TamanhoMaximoImagemEmBytes)
			return Promise.resolve("A imagem deve ter, no máximo, " + Estado.TamanhoMaximoImagemEmBytes + " bytes");

		return app.sql.connect(async (sql) => {
			if (!admin) {
				const i = await sql.scalar("select id from narrativa where id = ? and idusuario = ?", [estado.idnarrativa, idusuario]);
				if (!i)
					return "Narrativa não encontrada";
			}

			await sql.beginTransaction();

			try {
				await sql.query(`update estado set titulo = ?, descricao = ?, idestado1 = ?, texto1 = ?, idestado2 = ?, texto2 = ?, idestado3 = ?, texto3 = ?, idestado4 = ?, texto4 = ?, idestado5 = ?, texto5 = ? ${(imagem ? ", versao = versao + 1" : "")} where id = ? and idnarrativa = ?`, [estado.titulo, estado.descricao, estado.idestado1, estado.texto1, estado.idestado2, estado.texto2, estado.idestado3, estado.texto3, estado.idestado4, estado.texto4, estado.idestado5, estado.texto5, estado.id, estado.idnarrativa]);
			} catch (e: any) {
				if (e.code) {
					switch (e.code) {
						case "ER_DUP_ENTRY":
							return "Já existe um estado com este título nesta narrativa";
						default:
							throw e;
					}
				} else {
					throw e;
				}
			}

			if (!sql.affectedRows)
				return "Opção não encontrada";

			if (imagem)
				await app.fileSystem.saveUploadedFile(Estado.CaminhoRelativoImagem + estado.id + ".jpg", imagem);

			await sql.commit();

			return null;
		});
	}

	public static excluir(id: number, idnarrativa: number, idusuario: number, admin: boolean): Promise<string> {
		return app.sql.connect(async (sql) => {
			if (!admin) {
				const i = await sql.scalar("select id from narrativa where id = ? and idusuario = ?", [idnarrativa, idusuario]);
				if (!i)
					return "Narrativa não encontrada";
			}

			await sql.beginTransaction();

			await sql.query("delete from estado where id = ? and idnarrativa = ?", [id, idnarrativa]);

			if (!sql.affectedRows)
				return "Opção não encontrada";

			await app.fileSystem.deleteFile(Estado.CaminhoRelativoImagem + id + ".jpg");

			await sql.commit();

			return null;
		});
	}

	public static definirInicial(id: number, idnarrativa: number, idusuario: number, admin: boolean): Promise<string> {
		return app.sql.connect(async (sql) => {
			if (!admin) {
				const i = await sql.scalar("select id from narrativa where id = ? and idusuario = ?", [idnarrativa, idusuario]);
				if (!i)
					return "Narrativa não encontrada";
			}

			await sql.beginTransaction();

			await sql.query("update estado set inicial = 0 where idnarrativa = ? and inicial = 1", [idnarrativa]);

			await sql.query("update estado set inicial = 1 where id = ? and idnarrativa = ?", [id, idnarrativa]);

			if (!sql.affectedRows)
				return "Opção não encontrada";

			await sql.commit();

			return null;
		});
	}
}

export = Estado;
