const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const db = new sqlite3.Database('./ruffcol.db');

console.log('🔍 Verificando base de datos...\n');

db.all("SELECT * FROM usuario", [], (err, rows) => {
    if (err) {
        console.error('Error:', err);
    } else {
        console.log('👥 Usuarios en la base de datos:');
        rows.forEach(user => {
            console.log(`\nID: ${user.id}`);
            console.log(`Username: ${user.username}`);
            console.log(`Nombre: ${user.nombre}`);
            console.log(`Rol: ${user.rol}`);
            console.log(`Estado: ${user.estado_cuenta}`);
            console.log(`Tiene password: ${!!user.password}`);
            console.log(`Password length: ${user.password?.length}`);
        });
    }

    // Verificar si superadmin existe y probar la contraseña
    db.get("SELECT * FROM usuario WHERE username = 'superadmin'", [], (err, user) => {
        if (err) {
            console.error('\n❌ Error buscando superadmin:', err);
        } else if (!user) {
            console.log('\n❌ Superadmin no existe');
        } else {
            console.log('\n✅ Superadmin encontrado');
            console.log('Probando contraseña "admin123"...');
            const isValid = bcrypt.compareSync('admin123', user.password);
            console.log(`Contraseña válida: ${isValid}`);

            if (!isValid) {
                console.log('\n🔧 Recreando superadmin con contraseña correcta...');
                const passwordHash = bcrypt.hashSync('admin123', 10);
                db.run("UPDATE usuario SET password = ? WHERE username = 'superadmin'", [passwordHash], (err) => {
                    if (err) {
                        console.error('Error actualizando:', err);
                    } else {
                        console.log('✅ Superadmin actualizado con nueva contraseña');
                    }
                    db.close();
                });
            } else {
                db.close();
            }
        }
    });
});
