let userData = {
    nomeCliente: '',
    servicos: '',
    descricao: '',
    contato: ''
}

let currentIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
    const chatContainer = document.getElementById('chat-container');

    const savedData = localStorage.getItem('ngruby_lead') ? JSON.parse(localStorage.getItem('ngruby_lead')) : false;
    if (savedData) {
        const btn = document.createElement('button');
        btn.id = 'floating-chat-btn';
        
        btn.className = `
            fixed bottom-6 right-6 z-[100]
            bg-red-800 text-white p-4 rounded-full shadow-2xl 
            hover:bg-yellow-400 hover:scale-110 active:scale-95 
            transition-all duration-300 flex items-center justify-center
            shadow-lg font-bold
        `;

        const whatsappIcon = `
            <span class="mr-2">Olá ${savedData.nomeCliente.toUpperCase()}</span>
            <svg style="width:28px; height:28px;" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
        `;
        btn.innerHTML = whatsappIcon;

        btn.onclick = () => {
            const whatsMessage = `Olá! Sou o ${savedData.nomeCliente}, já conversamos antes. Quero o serviço: ${savedData.servicos}. Descrição: ${savedData.descricao}`;
            const whatsUrl = `https://api.whatsapp.com/send?phone=5511915082568&text=${encodeURIComponent(whatsMessage)}`;
            window.open(whatsUrl, true);
        };

        document.body.appendChild(btn);
    }

    chatContainer.innerHTML = `<div class="max-w-xl mx-auto bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-red-800">
        <div class="bg-red-800 p-4 text-white font-bold flex justify-between items-center">
            <span>🤖 Assistente NGRUBY</span>
            <span class="text-xs bg-white text-red-800 px-2 py-1 rounded-full animate-pulse">Online</span>
        </div>
        <div id="chat-window" class="h-96 overflow-y-auto p-4 space-y-4 bg-gray-800 text-left flex flex-col">
            <div class="bg-gray-700 text-white p-3 rounded-lg max-w-[80%] self-start shadow-sm">
                Olá! Sou o assistente virtual da NGRUBY. Para começarmos, qual o seu nome?
            </div>
        </div>
        <div class="p-4 border-t border-gray-700 flex gap-2 bg-gray-900">
            <input type="text" id="user-input" placeholder="Digite sua resposta..." 
                class="flex-1 border border-gray-600 bg-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-800 text-white placeholder-gray-500">
            <button id="send-btn" class="bg-red-800 text-white px-6 py-2 rounded-lg hover:bg-red-900 transition font-bold">
                Enviar
            </button>
        </div>
    </div>`;

    const chatWindow = document.getElementById('chat-window');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');

    const optionsServicos = [
        "Site One-Page (R$400)",
        "Site 3 Páginas FULL (R$599,90)",
        "Site com E-commerce (R$559,90 + mensalidade NuvemShop)",
        "Plataforma Digital 4.0 (R$927,90)",
        "App Mobile (R$1.420,00)"
    ];

    const botFlow = [
        { field: "nomeCliente" },
        { 
            question: (userData) => `Prazer, ${userData.nomeCliente}! Qual serviço você precisa?`, 
            field: "servicos",
            isOption: true,
            options: optionsServicos
        },
        { question: "Descreva brevemente seu projeto ou necessidades:", field: "descricao" },
        { question: "Perfeito! Por último, qual seu WhatsApp para entrarmos em contato?", field: "contato" }
    ];

    function addMessage(text, isUser = false, isOptions = false) {
        const msg = document.createElement('div');
        if (isOptions) {
            msg.className = "flex flex-wrap gap-2 mt-2 self-start";
            msg.innerHTML = text;
        } else {
            msg.className = isUser 
                ? "bg-red-800 text-white p-3 rounded-lg max-w-[80%] self-end shadow-md mb-2 font-medium" 
                : "bg-gray-700 text-white p-3 rounded-lg max-w-[80%] self-start shadow-sm mb-2";
            msg.innerText = text;
        }
        chatWindow.appendChild(msg);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    async function processAnswer() {
        const answer = userInput.value.trim();
        if (!answer) {
            return;
        }

        addMessage(answer, true);
        userInput.value = '';

        const fieldToSave = botFlow[currentIndex].field;
        userData[fieldToSave] = answer;

        localStorage.setItem('ngruby_lead', JSON.stringify(userData));

        currentIndex++;

        setTimeout(() => {
            if (currentIndex < botFlow.length) {
                const currentPhase = botFlow[currentIndex];
                
                if (currentPhase.isOption) {
                    addMessage(currentPhase.question(userData));
                    setTimeout(() => {
                        const optionsHtml = currentPhase.options.map(opt => 
                            `<button class="option-btn bg-red-800 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-900 transition" data-value="${opt}">${opt}</button>`
                        ).join('');
                        const optionsContainer = document.createElement('div');
                        optionsContainer.className = "flex flex-wrap gap-2 mt-2 self-start";
                        optionsContainer.innerHTML = optionsHtml;
                        chatWindow.appendChild(optionsContainer);
                        
                        document.querySelectorAll('.option-btn').forEach(btn => {
                            btn.addEventListener('click', () => {
                                const value = btn.getAttribute('data-value');
                                addMessage(value, true);
                                userData.servicos = value;
                                localStorage.setItem('ngruby_lead', JSON.stringify(userData));
                                currentIndex++;
                                setTimeout(() => {
                                    if (currentIndex < botFlow.length) {
                                        const nextPhase = botFlow[currentIndex];
                                        addMessage(typeof nextPhase.question === 'function' ? nextPhase.question(userData) : nextPhase.question);
                                    } else {
                                        endConversation();
                                    }
                                }, 500);
                            });
                        });
                        
                        chatWindow.scrollTop = chatWindow.scrollHeight;
                    }, 500);
                    return;
                }
                
                const nextPhase = currentPhase.question;
                addMessage(typeof nextPhase === 'function' ? nextPhase(userData) : nextPhase);
            } else {
                endConversation();
            }
        }, 800);
    }

    function endConversation() {
        addMessage("Obrigado! Gerando seu contato... 🚀");
        
        setTimeout(() => {
            const textMessage = `Olá! Meu nome é ${userData.nomeCliente}. Quero informações sobre: ${userData.servicos}. Descrição: ${userData.descricao}. Meu WhatsApp: ${userData.contato}`;
            const whatsUrl = `https://api.whatsapp.com/send?phone=5511915082568&text=${encodeURIComponent(textMessage)}`;

            addMessage(`Tudo pronto! Clique no botão para falarmos no WhatsApp:`);
            
            const btnZap = document.createElement('a');
            btnZap.href = whatsUrl;
            btnZap.target = "_blank";
            btnZap.className = "bg-red-800 text-white p-3 rounded-lg font-bold text-center mt-2 hover:bg-red-900 transition inline-block";
            btnZap.innerText = "Chamar no WhatsApp 📱";
            chatWindow.appendChild(btnZap);
        }, 1500);
    }

    sendBtn.addEventListener('click', processAnswer);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            processAnswer();
        }
    });
});
