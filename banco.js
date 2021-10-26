
async function conectar(){

    if (global.connection && global.connection.state !='disconected')  // na primeira ele não existe e, então, é posteriormente criado
    {
        return global.connection
    }

    const mysql = require('mysql2/promise')
    const connection = await mysql.createConnection('mysql://root:@localhost:3306/biblioteca')
    global.connection = connection
    return connection
}


async function listarLivros()
{
    const conexao = await conectar()
    const sqlLista = 'select * from livros order by nome;'
    const [livros] = await conexao.query(sqlLista)
    return livros
}

async function recuperarLivro(id)
{
    const conexao = await conectar()
    const sqlRecupera = 'select * from livros where isbn=?;'
    const [livros] = await conexao.query(sqlRecupera, [id])

    if (livros && livros.length > 0) return livros[0]
    else return {}


}

async function inserirLivro(livro)
{
    const conexao = await conectar()
    const sqlInsere = 'INSERT INTO livros (isbn, nome, autor, ano_publicacao) VALUES (?, ?, ?, ?);'
    return await conexao.query(sqlInsere, [livro.isbn, livro.tit, livro.aut, livro.ano])


}

async function excluirLivro()
{
    const conexao = await conectar()
    const sqlInsere = ''

}

async function buscarUsuario(usuario, senha)
{
    const conexao = await conectar()
    const sqlBusca = 'select * from usuarios where nome=? and senha=?;'
    const [linhas] = await conexao.query(sqlBusca, [usuario, senha])
    return linhas
}

async function alterarLivro(livro){
    const conexao = await conectar()
    const sqlAltera = 'UPDATE livros SET nome=?, autor=?, ano_publicacao=? WHERE isbn=?;'
    return await conexao.query(sqlAltera, [livro.tit, livro.aut, livro.ano, livro.id])

}


module.exports = { listarLivros, conectar, buscarUsuario, inserirLivro, recuperarLivro, alterarLivro }