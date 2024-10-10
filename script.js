// Defina sua chave da API aqui
const apiKey = '923a00fc9d51443b90aa7c3570f3b07c'; // Substitua pela sua chave API
const baseUrlEverything = `https://newsapi.org/v2/everything?apikey=${apiKey}&q=`;
const baseUrlTopHeadlines = `https://newsapi.org/v2/top-headlines?apikey=${apiKey}&country=us`;
const baseUrlSources = `https://newsapi.org/v2/sources?apikey=${apiKey}`;
const baseUrlLogs = 'https://www.piway.com.br/unoesc/api/logs/MATRICULA'; // Para exibir logs
const baseUrlInsertLog = 'https://www.piway.com.br/unoesc/api/inserir/log/MATRICULA/API/METODO/RESULTADO'; // Para inserir log
const baseUrlDeleteLog = 'https://www.piway.com.br/unoesc/api/excluir/log/IDLOG/aluno/MATRICULA'; // Para excluir log

const matricula = '417985'; // Substitua pelo seu número de matrícula

async function fetchTopHeadlines() {
    const apiUrl = baseUrlTopHeadlines;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`Erro: ${response.status} - ${response.statusText}`);
        const data = await response.json();
        if (!data.articles) {
            console.error('Nenhum artigo encontrado na resposta da API.');
            return;
        }
        displayNews(data.articles);
        await logAction('NewsAPI', 'top-headlines', JSON.stringify(data.articles.length)); // Registra log
    } catch (error) {
        console.error('Erro ao buscar as principais manchetes:', error);
    }
}

async function fetchEverything() {
    const query = document.getElementById('search').value || 'latest';
    const apiUrl = `${baseUrlEverything}${query}`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`Erro: ${response.status} - ${response.statusText}`);
        const data = await response.json();
        if (!data.articles) {
            console.error('Nenhum artigo encontrado na resposta da API.');
            return;
        }
        displayNews(data.articles);
        await logAction('NewsAPI', 'everything', query); // Registra log com a consulta
    } catch (error) {
        console.error('Erro ao buscar notícias:', error);
    }
}

async function fetchSources() {
    const apiUrl = baseUrlSources;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`Erro: ${response.status} - ${response.statusText}`);
        const data = await response.json();
        if (!data.sources) {
            console.error('Nenhuma fonte encontrada na resposta da API.');
            return;
        }
        displaySources(data.sources);
        await logAction('NewsAPI', 'sources', JSON.stringify(data.sources.length)); // Registra log
    } catch (error) {
        console.error('Erro ao buscar fontes de notícias:', error);
    }
}

async function logAction(api, method, result) {
    const apiUrl = baseUrlInsertLog
        .replace('MATRICULA', matricula)
        .replace('API', api)
        .replace('METODO', method)
        .replace('RESULTADO', result);

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        console.log(data); // Mostra a resposta da inserção do log
    } catch (error) {
        console.error('Erro ao registrar log:', error);
    }
}

async function fetchLogs() {
    const apiUrl = baseUrlLogs.replace('MATRICULA', matricula);
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`Erro: ${response.status} - ${response.statusText}`);
        const data = await response.json();
        displayLogs(data); // Exibe os logs
    } catch (error) {
        console.error('Erro ao buscar logs:', error);
    }
}

function displayLogs(logs) {
    const logsContainer = document.getElementById('logs-container');
    logsContainer.innerHTML = '';

    if (Array.isArray(logs) && logs.length > 0) {
        logs.forEach(log => {
            const logItem = document.createElement('div');
            logItem.classList.add('log-item');
            logItem.innerHTML = `
                <p><strong>API:</strong> ${log.api}</p>
                <p><strong>Método:</strong> ${log.metodo}</p>
                <p><strong>Resultado:</strong> ${log.resultado}</p>
                <button onclick="deleteLog(${log.id}, '${matricula}')">Excluir</button>
            `;
            logsContainer.appendChild(logItem);
        });
    } else {
        logsContainer.innerHTML = '<p>Nenhum log encontrado.</p>';
    }

    document.getElementById('logsModal').style.display = 'block'; // Abre o modal
}

async function deleteLog(id, matricula) {
    if (!id) {
        console.error('ID do log não fornecido.');
        return;
    }
    const apiUrl = baseUrlDeleteLog
        .replace('IDLOG', id)
        .replace('MATRICULA', matricula);
    
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        console.log(data); // Mostra a resposta da exclusão do log
        fetchLogs(); // Atualiza a lista de logs
    } catch (error) {
        console.error('Erro ao excluir log:', error);
    }
}

function closeModal() {
    document.getElementById('logsModal').style.display = 'none'; // Fecha o modal
}

function displayNews(articles) {
    const newsContainer = document.getElementById('news-container');
    newsContainer.innerHTML = '';

    articles.forEach(article => {
        const newsCard = document.createElement('div');
        newsCard.classList.add('news-card');

        const title = article.title || 'Sem título';
        const description = article.description || 'Sem descrição';
        const urlToImage = article.urlToImage || 'https://via.placeholder.com/150';
        const url = article.url || '#';

        newsCard.innerHTML = `
            <img src="${urlToImage}" alt="${title}">
            <h3>${title}</h3>
            <p>${description}</p>
            <a href="${url}" target="_blank">Leia mais</a>
        `;
        
        newsContainer.appendChild(newsCard);
    });
}

function displaySources(sources) {
    const newsContainer = document.getElementById('news-container');
    newsContainer.innerHTML = '';

    sources.forEach(source => {
        const newsCard = document.createElement('div');
        newsCard.classList.add('news-card');

        newsCard.innerHTML = `
            <h3>${source.name}</h3>
            <p>${source.description}</p>
        `;
        
        newsContainer.appendChild(newsCard);
    });
}
