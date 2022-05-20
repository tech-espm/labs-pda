import app = require("teem");
import DataUtil = require("../utils/dataUtil");

interface Narrativa {
	id: number;
	idusuario: number;
	nome: string;
	descricao: string;
	criacao: string;
}

class Narrativa {
	private static validar(narrativa: Narrativa): string {
		if (!narrativa)
			return "Narrativa inválida";

		narrativa.id = parseInt(narrativa.id as any);

		narrativa.idusuario = parseInt(narrativa.idusuario as any);
		if (isNaN(narrativa.idusuario))
			return "Usuário inválido";

		narrativa.nome = (narrativa.nome || "").normalize().trim();
		if (narrativa.nome.length < 3 || narrativa.nome.length > 100)
			return "Nome inválido";

		narrativa.descricao = (narrativa.descricao || "").normalize().trim();
		if (narrativa.descricao.length > 100000)
			return "Descrição inválida";

		return null;
	}

	public static listar(idusuario: number, admin: boolean): Promise<Narrativa[]> {
		return app.sql.connect(async (sql) => {
			if (admin)
				return (await sql.query("select n.id, n.nome, n.idusuario, u.nome usuario, date_format(n.criacao, '%d/%m/%Y') criacao from narrativa n inner join usuario u on u.id = n.idusuario")) as Narrativa[] || [];
			else
				return (await sql.query("select id, nome, date_format(criacao, '%d/%m/%Y') criacao from narrativa where idusuario = ?", [idusuario])) as Narrativa[] || [];
		});
	}

	public static obter(id: number, idusuario: number, admin: boolean): Promise<Narrativa> {
		return app.sql.connect(async (sql) => {
			let lista: Narrativa[];

			if (admin)
				lista = (await sql.query("select id, idusuario, nome, descricao from narrativa where id = ?", [id])) as Narrativa[];
			else
				lista = (await sql.query("select id, idusuario, nome, descricao from narrativa where id = ? and idusuario = ?", [id, idusuario])) as Narrativa[];

			return (lista && lista[0]) || null;
		});
	}

	public static criar(narrativa: Narrativa): Promise<string> {
		const erro = Narrativa.validar(narrativa);
		if (erro)
			return Promise.resolve(erro);

		return app.sql.connect(async (sql) => {
			await sql.query("insert into narrativa (idusuario, nome, descricao, criacao) values (?, ?, ?, ?)", [narrativa.idusuario, narrativa.nome, narrativa.descricao, DataUtil.horarioDeBrasiliaISOComHorario()]);

			return null;
		});
	}

	public static editar(narrativa: Narrativa): Promise<string> {
		const erro = Narrativa.validar(narrativa);
		if (erro)
			return Promise.resolve(erro);

		return app.sql.connect(async (sql) => {
			await sql.query("update narrativa set nome = ?, descricao = ? where id = ? and idusuario = ?", [narrativa.nome, narrativa.descricao, narrativa.id, narrativa.idusuario]);

			return null;
		});
	}

	public static excluir(id: number, idusuario: number, admin: boolean): Promise<string> {
		return app.sql.connect(async (sql) => {

			await sql.beginTransaction();

			let idsEstados: any[] = await sql.query("select id from estado where idnarrativa = ?", [id]);

			if (admin)
				await sql.query("delete from narrativa where id = ?", [id]);
			else
				await sql.query("delete from narrativa where id = ? and idusuario = ?", [id, idusuario]);

			if (!sql.affectedRows)
				return "Narrativa não encontrada";

			for (let i = 0; i < idsEstados.length; i++) {
				// @@@ Excluir o arquivo idsEstados[i].id
			}

			await sql.commit();

			return null;
		});
	}
}

export = Narrativa;
