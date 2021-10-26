

const express = require("express")
const ejs = require('ejs')
const path = require('path') 
const session = require('express-session')
const bodyParser = require('body-parser')
const db = require("./banco")


const caminhoViews = path.join(__dirname, '/views')
const porta = 3000
const app = express()

app.use( session({secret: 'uhterere'}))
app.use( bodyParser.urlencoded({extended:true}))
app.engine('html', ejs.renderFile)
app.set('view engine' , 'html')  
app.set('views' , caminhoViews)

    // ---- DEIXA DISPONIVEL AS PAGINAS QUE O USUARIO PODE ACESSAR ---- //

// app.get( enderecoSolicitado , funcaoControle )

    
// Jeito mais iniciante
/// endereco root
//app.get('/', funcaoControle)

//function funcaoControle(req, res){}

function verificarLogin(req, res){
    if (!req.session.usuario || req.session.usuario == ""){
        res.render('erro', {mensagem: 'Acesso proibido', link: '/'})
    }

}

// modelo arrow function

app.get('/' , (req, res) => {

    res.render('login')

})

app.post('/', async (req, res) =>{
    
    const usuarioEntrando = req.body.txtUsuario
    const senhaEntrando = req.body.pswSenha

    const linhas = await db.buscarUsuario(usuarioEntrando, senhaEntrando)

    let achou = false
    if (linhas && linhas.length > 0) {
        achou = true
    }

    if (achou)
    {
        req.session.usuario = usuarioEntrando
        res.render('principal')
    }
    else
    {
        res.render('login')
    }

    // verifica se o campo txtUsuario contem o valor Admin
   /* if (req.body.txtUsuario == 'admin' && req.body.pswSenha == '123')
    {
        req.session.usuario = 'admin'


        res.render('principal')
    }else{
        res.render('login')
    }*/

})

app.get('/livros', async (req, res) => {
        // verifica se existe usuário logado
        verificarLogin(req, res)
        const livros = await db.listarLivros()
        //console.log(livros)
        res.render('listagemLivros', {livros} )

})

app.get('/novo', (req, res) => {
    verificarLogin(req, res)
    res.render('cadastroLivro', {titulo:'Cadastro de livro', result:{}, action:'/novo'})



})

app.post('/novo', async (req, res) => {
    const isbn = req.body.txtIsbn
    const tit = req.body.txtTitulo
    const aut = req.body.txtAutor
    const ano = req.body.txtAno

    const livro = {isbn, tit, aut, ano}

    // chamar a função do BD que insere um novo livro
    await db.inserirLivro(livro)

    res.redirect('/livros')


})

app.get('/alterar_Livro/:id', async (req, res) => {
    verificarLogin(req, res)
    const id = req.params.id

    const result = await db.recuperarLivro(id)

    if (result == {})
    {
        res.render('erro', {mensagem: 'Livro inexistente', link: '/livros'})

    }else
    {
       
        res.render('cadastroLivro', {titulo: 'Alteração de livro', result, action: '/alterar_Livro/' + id})
    }

})

app.post('/alterar_Livro/:id', async (req, res) =>{
    const id = req.params.id
    const tit = req.body.txtTitulo
    const aut = req.body.txtAutor
    const ano = req.body.txtAno

    const livro = {tit, aut, ano, id}

    await db.alterarLivro(livro)

    res.redirect('/livros')
    
})

// iniciar na porta desejada
app.listen(porta)