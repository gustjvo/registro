document.addEventListener('DOMContentLoaded', () => {
    const cadastroForm = document.getElementById('cadastroForm');
    const loginForm = document.getElementById('loginForm');
  
    if (cadastroForm) {
      cadastroForm.addEventListener('submit', (e) => {
        e.preventDefault();
  
        const user = {
          nome: document.getElementById('cadNome').value,
          endereco: document.getElementById('cadEndereco').value,
          telefone: document.getElementById('cadTelefone').value,
          email: document.getElementById('cadEmail').value,
          senha: document.getElementById('cadSenha').value
        };
  
        localStorage.setItem('usuarioCadastrado', JSON.stringify(user));
        alert("Cadastro realizado com sucesso!");
        window.location.href = "login.html";
      });
    }
  
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
    
        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;
        const erro = document.getElementById('loginError');
    
        const user = JSON.parse(localStorage.getItem('usuarioCadastrado'));
    
        if (
          user &&
          nome === user.nome &&
          email === user.email &&
          senha === user.senha
        ) {
          localStorage.setItem('usuarioLogadoEmail', email);
          localStorage.setItem('usuarioLogadoNome', nome);
          
          window.location.href = "index.html";
        } else {
          erro.textContent = "Credenciais inválidas!";
        }
      });
    }
    
  });
  