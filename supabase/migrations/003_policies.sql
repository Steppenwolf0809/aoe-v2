-- PROFILES: usuario solo ve/edita su perfil
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- CONTRACTS: usuario solo ve/crea sus contratos
CREATE POLICY "Users can view own contracts"
  ON contracts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own contracts"
  ON contracts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- SUBSCRIPTIONS: usuario solo ve su suscripcion
CREATE POLICY "Users can view own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- BLOG: lectura publica de posts publicados
CREATE POLICY "Anyone can read published posts"
  ON blog_posts FOR SELECT
  USING (published = true);

-- CALCULATOR SESSIONS: escritura publica (anonimo)
CREATE POLICY "Anyone can insert calculator sessions"
  ON calculator_sessions FOR INSERT
  WITH CHECK (true);

-- LEADS: escritura publica
CREATE POLICY "Anyone can insert leads"
  ON leads FOR INSERT
  WITH CHECK (true);

-- ADMIN: acceso total
CREATE POLICY "Admins have full access to profiles"
  ON profiles FOR ALL
  USING (auth.jwt() ->> 'user_role' = 'ADMIN');

CREATE POLICY "Admins have full access to contracts"
  ON contracts FOR ALL
  USING (auth.jwt() ->> 'user_role' = 'ADMIN');

CREATE POLICY "Admins have full access to blog posts"
  ON blog_posts FOR ALL
  USING (auth.jwt() ->> 'user_role' = 'ADMIN');

CREATE POLICY "Admins can read all leads"
  ON leads FOR SELECT
  USING (auth.jwt() ->> 'user_role' = 'ADMIN');

CREATE POLICY "Admins can read all calculator sessions"
  ON calculator_sessions FOR SELECT
  USING (auth.jwt() ->> 'user_role' = 'ADMIN');

CREATE POLICY "Admins can read audit log"
  ON audit_log FOR SELECT
  USING (auth.jwt() ->> 'user_role' = 'ADMIN');
