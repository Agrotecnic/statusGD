const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log('Tentando conectar ao MongoDB Atlas...');
        
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI não está definida nas variáveis de ambiente');
        }

        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            retryWrites: true,
            w: 'majority'
        });
        
        console.log('MongoDB Atlas conectado com sucesso');
    } catch (error) {
        console.error('Erro ao conectar ao MongoDB:', error);
        // Não encerrar o processo em caso de erro
        // process.exit(1);
    }
};

module.exports = connectDB;