module.exports = ({ env }) => ({
  connection: {
    client: "postgres",
    connection: {
      host: env("DATABASE_HOST", "ec2-34-194-40-194.compute-1.amazonaws.com"),
      port: env.int("DATABASE_PORT", 5432),
      database: env("DATABASE_NAME", "d43j9ti85f8j8s"),
      user: env("DATABASE_USERNAME", "lmvogbaqelrhrr"),
      password: env("DATABASE_PASSWORD", "3fb45276bdc6b795cb4fee64f950e5eb9ac0db60bbcb57390e4524bcbb433cca"),
      schema: env("DATABASE_SCHEMA", "public"), // Not required
      ssl: {
        rejectUnauthorized: env.bool("DATABASE_SSL_SELF", false),
      },
    },
    debug: false,
    useNullAsDefault: true,
  },
});

