document.addEventListener('DOMContentLoaded', function () {

  const form = document.getElementById('registroForm');
  const errorMsg = document.getElementById('errorMsg');
  const fotoInput = document.getElementById('foto');
  const addButton = document.getElementById('addButton');
  const removeButton = document.getElementById('removeButton');

  emailjs.init('gcyb6p4O0S_bXcHSO');

  //Anexar Imagem
  addButton.addEventListener('click', function () {
    fotoInput.click();
  });

  // Imagem selecionada
  fotoInput.addEventListener('change', function () {
    if (fotoInput.files.length > 0) {
      addButton.style.display = 'none';
      removeButton.style.display = 'block';
    }
  });

  // Remover imagem
  removeButton.addEventListener('click', function () {
    fotoInput.value = '';
    removeButton.style.display = 'none';
    addButton.style.display = 'block';
  });

  
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const descricao = document.getElementById('descricao').value.trim();
    const local = document.getElementById('local').value.trim();
    const data = document.getElementById('data').value;

    if (!descricao || !local || !data) {
      errorMsg.textContent = 'Por favor, preencha todos os campos obrigatórios.';
      return;
    }

    errorMsg.textContent = '';

    const id = 'ID-' + Math.floor(100000 + Math.random() * 900000);

    let imagem = null;
    if (fotoInput.files.length > 0) {
      imagem = await carregarImagem(fotoInput.files[0]);
    }

    const reportImage = await gerarRelatorioImagem(id, data, descricao, local, imagem);

    await enviarEmail(id, data, descricao, local, reportImage);


    baixarImagem(reportImage, `relatorio-${id}.png`);

   
    form.reset();
    addButton.style.display = 'block';
    removeButton.style.display = 'none';
    fotoInput.value = '';
  });

  // carregar imagem
  function carregarImagem(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  
  async function gerarRelatorioImagem(id, data, descricao, local, imagem) {
    const canvas = document.getElementById('relatorioCanvas');
    const ctx = canvas.getContext('2d');

    const largura = 600;
    let altura = 350;
    if (imagem) altura += imagem.height * (500 / imagem.width);

    canvas.width = largura;
    canvas.height = altura;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, largura, altura);

    ctx.fillStyle = '#000';
    ctx.font = 'bold 18px Arial';
    ctx.fillText(id, 20, 30);
    ctx.fillText(data, largura - 200, 30);

    ctx.font = 'bold 22px Arial';
    ctx.fillText('Relatório de Anormalidade', 20, 70);

    ctx.font = '16px Arial';
    ctx.fillText('Descrição:', 20, 110);
    escreverTextoMultilinha(ctx, descricao, 40, 130, 540, 20);

    let posY = 170 + Math.ceil(descricao.length / 70) * 20;
    ctx.fillText('Local:', 20, posY);
    escreverTextoMultilinha(ctx, local, 40, posY + 20, 540, 20);

    if (imagem) {
      let imgY = posY + 80;
      const imgLargura = 500;
      const imgAltura = imagem.height * (imgLargura / imagem.width);
      ctx.drawImage(imagem, 50, imgY, imgLargura, imgAltura);
    }

    return canvas.toDataURL("image/png");
  }

  
  async function enviarEmail(id, data, descricao, local, reportImage) {
    const userEmail = localStorage.getItem('usuarioLogadoEmail');
    const userName = localStorage.getItem('usuarioLogadoNome') || 'Usuário';

    if (!userEmail) {
      alert("E-mail do usuário não encontrado. Faça login novamente.");
      return;
    }

    const emailParams = {
      to_email: userEmail,
      from_name: 'Sistema de Anomalias',
      to_name: userName,
      descricao: descricao,
      local: local,
      data: data,
      report_image: reportImage,
    };

    try {
      const response = await emailjs.send('service_jrzcrcz', 'template_un3ylim', emailParams);
      console.log('E-mail enviado com sucesso:', response);
    } catch (error) {
      console.error('Erro ao enviar o e-mail:', error);
    }
  }

  // quebrar texto em linhas
  function escreverTextoMultilinha(ctx, texto, x, y, maxWidth, lineHeight) {
    const palavras = texto.split(' ');
    let linha = '';
    for (let i = 0; i < palavras.length; i++) {
      const teste = linha + palavras[i] + ' ';
      const largura = ctx.measureText(teste).width;
      if (largura > maxWidth && i > 0) {
        ctx.fillText(linha, x, y);
        linha = palavras[i] + ' ';
        y += lineHeight;
      } else {
        linha = teste;
      }
    }
    ctx.fillText(linha, x, y);
  }

  function baixarImagem(base64Image, nomeArquivo) {
    const link = document.createElement('a');
    link.href = base64Image;
    link.download = nomeArquivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

});
