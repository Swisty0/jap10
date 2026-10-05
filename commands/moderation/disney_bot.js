const fs = require('fs');
const path = require('path');

// Dosya yolları
const accountsFilePath = path.join(__dirname, 'disney_accounts.json');

// Hesapları JSON dosyasından okuma fonksiyonu
function loadAccounts() {
    try {
        if (!fs.existsSync(accountsFilePath)) {
            // Eğer dosya yoksa varsayılan şablon oluştur
            const defaultData = {
                accounts: [],
                stats: { totalDistributed: 0 },
                cooldowns: {}
            };
            fs.writeFileSync(accountsFilePath, JSON.stringify(defaultData, null, 2), 'utf8');
            return defaultData;
        }
        const data = fs.readFileSync(accountsFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Disney hesapları okunurken hata oluştu:', error);
        return { accounts: [], stats: { totalDistributed: 0 }, cooldowns: {} };
    }
}

// Verileri JSON dosyasına kaydetme fonksiyonu
function saveAccounts(data) {
    try {
        fs.writeFileSync(accountsFilePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error('Disney hesapları kaydedilirken hata oluştu:', error);
    }
}

// Stoktan rastgele veya sıradaki bir Disney Plus hesabını çekme (Dağıtma) fonksiyonu
function getDisneyAccount(userId = null) {
    const db = loadAccounts();

    if (!db.accounts || db.accounts.length === 0) {
        return { success: false, message: 'Stokta hiç Disney Plus hesabı kalmadı!' };
    }

    // Cooldown kontrolü (İsteğe bağlı olarak kullanılabilir)
    if (userId && db.cooldowns && db.cooldowns[userId]) {
        const lastTime = db.cooldowns[userId];
        const cooldownTime = 24 * 60 * 60 * 1000; // 24 saat
        if (Date.now() - lastTime < cooldownTime) {
            const remainingHours = Math.ceil((cooldownTime - (Date.now() - lastTime)) / (1000 * 60 * 60));
            return { success: false, message: `Yeni bir hesap almak için ${remainingHours} saat beklemelisin.` };
        }
    }

    // Listeden bir hesap çek (Örn: İlk sıradakini al ve listeden çıkar)
    const account = db.accounts.shift();

    // İstatistikleri güncelle
    db.stats.totalDistributed = (db.stats.totalDistributed || 0) + 1;

    // Kullanıcıya cooldown uygula
    if (userId) {
        if (!db.cooldowns) db.cooldowns = {};
        db.cooldowns[userId] = Date.now();
    }

    // Güncel veriyi dosyaya kaydet
    saveAccounts(db);

    return { 
        success: true, 
        account: account, 
        remainingStock: db.accounts.length 
    };
}

module.exports = {
    loadAccounts,
    saveAccounts,
    getDisneyAccount
};
