import app = require("teem");

interface Estado {
	id: number;
	idnarrativa: number;
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
	public static readonly TamanhoMaximoImagemEmBytes = 512 * 1024;

	private static validar(estado: Estado): string {
		if (!estado)
			return "Estado Inválido!";

		estado.id = parseInt(estado.id as any);
		
		estado.idnarrativa = parseInt(estado.idnarrativa as any);
		if (isNaN(estado.idnarrativa))
				return "Narrativa inválida";

		estado.titulo = (estado.titulo || "").normalize().trim();	
			if (estado.titulo.length < 3 || estado.titulo.length > 30 )
				return "Titulo inválido";

		estado.descricao = (estado.descricao || "").normalize().trim();
			if (estado.descricao.length < 3 || estado.descricao.length > 10000)
				return "Descrição inválida";

			
		estado.idestado1 = parseInt(estado.idestado1 as any);
		if (isNaN)

		estado.texto1 = (estado.texto1 || "").normalize().trim();	
			if (estado.texto1.length < 3 || estado.texto1.length > 50 )
				return "texto inválido";

		//DUVIDA PARA O RAFA ID TEXTO 		
		let contador = 1;
		estado.idestado2 = parseInt(estado.idestado2 as any);
		estado.idestado3 = parseInt(estado.idestado3 as any);
		estado.idestado4 = parseInt(estado.idestado4 as any);
		estado.idestado5 = parseInt(estado.idestado5 as any);


		return null;	
	}

	public static listar(idnarrativa: number, idusuario: number, admin: boolean): Promise<Estado[]> {

		return app.sql.connect(async (sql) => {
			if(admin){
				return (await sql.query ("select n.id, n.idusuario, n.nome, e.id, e.titulo, e.idestado1, e.texto1, e.idestado2, e.texto2 , e.idestado3, e.texto3,  e.idestado4, e.texto4 , e.idestado5, e.texto5  from narrativa n inner join estado e on n.idnarrativa=e.idnarrativa;")) as Estado [] || [];
			}else{
				return (await sql.query ("select id, titulo, descricao , idestado1, texto1, idestado2, texto2 , idestado3, texto3, idestado4, texto4 ,idestado5, texto5 from estado where idnarrativa = ?", [idnarrativa])) as Estado [] || [];
			}
			
		});
	}

	public static obter(id: number, idnarrativa: number, idusuario: number, admin: boolean): Promise<Estado> {
		
		return app.sql.connect(async (sql) => {
			let lista : Estado[];
				if(admin){
					lista = (await sql.query ("select id , titulo , descricao ,  idestado1, texto1, idestado2, texto2 , idestado3, texto3, idestado4, texto4 ,idestado5, texto5 from estado where id = ?", [id])) as Estado [];
				}else{
					lista = (await sql.query ("select id , titulo, descricao ,  idestado1, texto1, idestado2, texto2 , idestado3, texto3, idestado4, texto4 ,idestado5, texto5 from estado where id = ? and idusuario = ?", [id,idusuario])) as Estado []; 
				}
			return (lista && lista[0]) || null;
		});
	}

	public static criar(estado: Estado, imagem: app.UploadedFile, idusuario: number, admin: boolean): Promise<string> {
		const erro = Estado.validar(estado);
		if (erro)
			return Promise.resolve(erro);

		if (!imagem)
			return Promise.resolve("Imagem inválida!");

		if (imagem.size > Estado.TamanhoMaximoImagemEmBytes)
			return Promise.resolve("A imagem deve ter, no máximo, " + Estado.TamanhoMaximoImagemEmBytes + " bytes");

		return app.sql.connect(async (sql) => {

			await app.fileSystem.saveUploadedFile("public/xxx/yyy/zzz.jpg", imagem);
			await sql.query ("insert into estado (idnarrativa, titulo, descricao, idestado1, texto1, idestado2, texto2, idestado3, texto3, idestado4, texto4, idestado5, texto5) values (?,?,?,?,?,?,?,?,?,?,?,?,?)" , [estado.idnarrativa , estado.titulo, estado.descricao, estado.idestado1, estado.texto1,estado.idestado2, estado.texto2, estado.idestado3, estado.texto3,estado.idestado4,estado.texto4, estado.idestado5, estado.texto5]);

			return null;
		});
	}

	public static editar(estado: Estado, imagem: app.UploadedFile, idusuario: number, admin: boolean): Promise<string> {
		const erro = Estado.validar(estado);
		if (erro)
			return Promise.resolve(erro);

		if (imagem && imagem.size > Estado.TamanhoMaximoImagemEmBytes)
			return Promise.resolve("A imagem deve ter, no máximo, " + Estado.TamanhoMaximoImagemEmBytes + " bytes");

		return app.sql.connect(async (sql) => {

			if (imagem){
				await app.fileSystem.saveUploadedFile("public/xxx/yyy/zzz.jpg", imagem);
			}

			await sql.query ("update estado set titulo = ?, descricao = ?, texto1 = ?, texto2 = ?, texto3 = ?, texto4 = ?, texto5 = ? where id = ? , idusuario = ?)" , [ estado.titulo, estado.descricao, estado.texto1, estado.texto2,  estado.texto3, estado.texto4, estado.texto5, estado.id, idusuario]);
	
			return null;
		});
	}

	public static excluir(id: number, idnarrativa: number, idusuario: number, admin: boolean): Promise<string> {
		return app.sql.connect(async (sql) => {

			await sql.beginTransaction();

			let idestado = await sql.query ("select id from estado where id = ?" , [id]);

			if (admin)
				await sql.query("delete from estado where id = ?", [id]);
			else
				await sql.query("delete from estado where id = ? and idusuario = ?", [id, idusuario]);

			if (!sql.affectedRows)
				return "Estado não encontrado";

			//EXCLUIR IMAGENS DO ESTADO 

			await sql.commit();

			return null;
		});
	}
}

export = Estado;
