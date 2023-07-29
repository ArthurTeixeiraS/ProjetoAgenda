const mongoose = require('mongoose');
const validator = require('validator')

const ContatoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastname: { type: String, required: false, default:''},
  email: { type: String, required: false, default:'' },
  phone: { type: String, required: false, default:'' },
  createAt: { type: Date, required: false, default:Date.now },

});

const ContatoModel = mongoose.model('Contato', ContatoSchema);

function Contato (body){
  this.body = body
  this.errors = []
  this.contato = null
}

Contato.prototype.register = async function(){
  this.valida();
  if(this.errors.length > 0 ) return;
  this.contato = await ContatoModel.create(this.body)
};

Contato.prototype.valida = function() {
  this.cleanUp()
  if(this.body.email && !validator.isEmail(this.body.email)) this.errors.push('Email inválido');
  if(!this.body.email && !this.body.phone) this.errors.push('Pelo menos uma forma de contato precisa ser enviada: Email ou Telefone')
}

Contato.prototype.cleanUp = function() {
  for (const key in this.body){
    if(typeof this.body[key] !== 'string'){
      this.body[key] = '';
    }
  }

  this.body = {
    name: this.body.name,
    lastname: this.body.lastname,
    email: this.body.email,
    phone: this.body.phone
  };
}
Contato.prototype.edit = async function(id){
  if(typeof id !== 'string') return
  this.valida()
  if(this.errors.length > 0) return
  this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, {new:true})
}

//Metodos estáticos
Contato.buscaPorID = async function(id){
  if(typeof id !== 'string') return;
  const user = await ContatoModel.findById(id);
  return user;
}
Contato.buscaContatos = async function(){
  const contatos = await ContatoModel.find()
  .sort({createAt: -1})
  return contatos;
}
Contato.delete = async function(id){
  if(typeof id !== 'string') return;
  const contato = await ContatoModel.findOneAndDelete({_id: id})
  return contato;
}



module.exports = Contato;
