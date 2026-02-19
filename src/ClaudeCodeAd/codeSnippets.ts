// ─── Syntax-highlighted code snippets ─────────────────────────────────────────
// Each entry is an array of { text, color } spans per line

import { PALETTE } from './palette';

export type CodeSpan = { text: string; color: string };
export type CodeLine = CodeSpan[];

const K = PALETTE.codePurple;  // keywords
const T = PALETTE.codeBlue;    // types / identifiers
const S = PALETTE.codeYellow;  // strings
const F = PALETTE.codeGreen;   // functions
const C = PALETTE.codeDim;     // comments / punctuation
const W = PALETTE.white;       // plain text
const O = PALETTE.codeOrange;  // decorators / annotations
const N = '#E879F9';           // numbers / specials

export const SERVER_TS: CodeLine[] = [
	[{text: '// server.ts', color: C}],
	[{text: 'import ', color: K}, {text: 'express ', color: W}, {text: 'from ', color: K}, {text: '"express"', color: S}],
	[{text: 'import ', color: K}, {text: '{ ', color: C}, {text: 'authRouter ', color: T}, {text: '} ', color: C}, {text: 'from ', color: K}, {text: '"./auth"', color: S}],
	[{text: 'import ', color: K}, {text: '{ ', color: C}, {text: 'prisma ', color: T}, {text: '} ', color: C}, {text: 'from ', color: K}, {text: '"./db"', color: S}],
	[{text: '', color: W}],
	[{text: 'const ', color: K}, {text: 'app ', color: T}, {text: '= ', color: C}, {text: 'express', color: F}, {text: '()', color: C}],
	[{text: 'const ', color: K}, {text: 'PORT ', color: N}, {text: '= ', color: C}, {text: 'process', color: T}, {text: '.env.PORT || ', color: C}, {text: '"3000"', color: S}],
	[{text: '', color: W}],
	[{text: 'app', color: T}, {text: '.use', color: F}, {text: '(express', color: C}, {text: '.json', color: F}, {text: '())', color: C}],
	[{text: 'app', color: T}, {text: '.use', color: F}, {text: '(', color: C}, {text: '"/auth"', color: S}, {text: ', authRouter)', color: C}],
	[{text: '', color: W}],
	[{text: 'app', color: T}, {text: '.get', color: F}, {text: '(', color: C}, {text: '"/api/users"', color: S}, {text: ', ', color: C}, {text: 'async ', color: K}, {text: '(req, res) => {', color: C}],
	[{text: '  ', color: W}, {text: 'const ', color: K}, {text: 'users ', color: T}, {text: '= ', color: C}, {text: 'await ', color: K}, {text: 'prisma', color: T}, {text: '.user', color: F}, {text: '.findMany()', color: C}],
	[{text: '  ', color: W}, {text: 'res', color: T}, {text: '.json', color: F}, {text: '(users)', color: C}],
	[{text: '})', color: C}],
	[{text: '', color: W}],
	[{text: 'app', color: T}, {text: '.listen', color: F}, {text: '(PORT, () => {', color: C}],
	[{text: '  ', color: W}, {text: 'console', color: T}, {text: '.log', color: F}, {text: '(', color: C}, {text: '`Server on port ${PORT}`', color: S}, {text: ')', color: C}],
	[{text: '})', color: C}],
];

export const AUTH_TS: CodeLine[] = [
	[{text: '// auth.ts', color: C}],
	[{text: 'import ', color: K}, {text: 'jwt ', color: T}, {text: 'from ', color: K}, {text: '"jsonwebtoken"', color: S}],
	[{text: 'import ', color: K}, {text: 'bcrypt ', color: T}, {text: 'from ', color: K}, {text: '"bcryptjs"', color: S}],
	[{text: 'import ', color: K}, {text: '{ ', color: C}, {text: 'Router ', color: T}, {text: '} ', color: C}, {text: 'from ', color: K}, {text: '"express"', color: S}],
	[{text: '', color: W}],
	[{text: 'const ', color: K}, {text: 'router ', color: T}, {text: '= ', color: C}, {text: 'Router', color: F}, {text: '()', color: C}],
	[{text: 'const ', color: K}, {text: 'SECRET ', color: N}, {text: '= ', color: C}, {text: 'process', color: T}, {text: '.env.JWT_SECRET!', color: C}],
	[{text: '', color: W}],
	[{text: 'router', color: T}, {text: '.post', color: F}, {text: '(', color: C}, {text: '"/register"', color: S}, {text: ', ', color: C}, {text: 'async ', color: K}, {text: '(req, res) => {', color: C}],
	[{text: '  ', color: W}, {text: 'const ', color: K}, {text: '{ email, password } ', color: T}, {text: '= req.body', color: C}],
	[{text: '  ', color: W}, {text: 'const ', color: K}, {text: 'hash ', color: T}, {text: '= ', color: C}, {text: 'await ', color: K}, {text: 'bcrypt', color: T}, {text: '.hash', color: F}, {text: '(password, ', color: C}, {text: '10', color: N}, {text: ')', color: C}],
	[{text: '  ', color: W}, {text: 'const ', color: K}, {text: 'user ', color: T}, {text: '= ', color: C}, {text: 'await ', color: K}, {text: 'prisma', color: T}, {text: '.user', color: F}, {text: '.create({', color: C}],
	[{text: '    data: { email, password: hash }', color: C}],
	[{text: '  })', color: C}],
	[{text: '  ', color: W}, {text: 'const ', color: K}, {text: 'token ', color: T}, {text: '= jwt', color: C}, {text: '.sign', color: F}, {text: '({ id: user.id }, SECRET)', color: C}],
	[{text: '  res', color: C}, {text: '.json', color: F}, {text: '({ token })', color: C}],
	[{text: '})', color: C}],
];

export const SCHEMA_PRISMA: CodeLine[] = [
	[{text: '// schema.prisma', color: C}],
	[{text: 'generator ', color: K}, {text: 'client {', color: T}],
	[{text: '  provider ', color: T}, {text: '= ', color: C}, {text: '"prisma-client-js"', color: S}],
	[{text: '}', color: C}],
	[{text: '', color: W}],
	[{text: 'datasource ', color: K}, {text: 'db {', color: T}],
	[{text: '  provider ', color: T}, {text: '= ', color: C}, {text: '"postgresql"', color: S}],
	[{text: '  url ', color: T}, {text: '= ', color: C}, {text: 'env(', color: F}, {text: '"DATABASE_URL"', color: S}, {text: ')', color: C}],
	[{text: '}', color: C}],
	[{text: '', color: W}],
	[{text: 'model ', color: K}, {text: 'User {', color: T}],
	[{text: '  id        ', color: T}, {text: 'String ', color: N}, {text: ' @id @default(', color: O}, {text: 'cuid', color: F}, {text: '())', color: C}],
	[{text: '  email     ', color: T}, {text: 'String ', color: N}, {text: ' @unique', color: O}],
	[{text: '  password  ', color: T}, {text: 'String', color: N}],
	[{text: '  createdAt ', color: T}, {text: 'DateTime ', color: N}, {text: '@default(', color: O}, {text: 'now', color: F}, {text: '())', color: C}],
	[{text: '  posts     ', color: T}, {text: 'Post[]', color: N}],
	[{text: '}', color: C}],
	[{text: '', color: W}],
	[{text: 'model ', color: K}, {text: 'Post {', color: T}],
	[{text: '  id      ', color: T}, {text: 'String ', color: N}, {text: '@id @default(', color: O}, {text: 'cuid', color: F}, {text: '())', color: C}],
	[{text: '  title   ', color: T}, {text: 'String', color: N}],
	[{text: '  author  ', color: T}, {text: 'User ', color: N}, {text: '  @relation(fields: [userId], ...)', color: C}],
	[{text: '}', color: C}],
];

export const APP_TSX: CodeLine[] = [
	[{text: '// App.tsx', color: C}],
	[{text: 'import ', color: K}, {text: 'React ', color: T}, {text: 'from ', color: K}, {text: '"react"', color: S}],
	[{text: 'import ', color: K}, {text: '{ ', color: C}, {text: 'BrowserRouter, Routes, Route ', color: T}, {text: '} ', color: C}, {text: 'from ', color: K}, {text: '"react-router-dom"', color: S}],
	[{text: 'import ', color: K}, {text: '{ ', color: C}, {text: 'AuthProvider ', color: T}, {text: '} ', color: C}, {text: 'from ', color: K}, {text: '"./contexts/auth"', color: S}],
	[{text: '', color: W}],
	[{text: 'const ', color: K}, {text: 'App: React', color: T}, {text: '.FC ', color: F}, {text: '= () => {', color: C}],
	[{text: '  return (', color: C}],
	[{text: '    ', color: W}, {text: '<AuthProvider>', color: T}],
	[{text: '      ', color: W}, {text: '<BrowserRouter>', color: T}],
	[{text: '        ', color: W}, {text: '<Routes>', color: T}],
	[{text: '          ', color: W}, {text: '<Route ', color: T}, {text: 'path=', color: C}, {text: '"/" ', color: S}, {text: 'element=', color: C}, {text: '{<Home />}', color: K}, {text: ' />', color: T}],
	[{text: '          ', color: W}, {text: '<Route ', color: T}, {text: 'path=', color: C}, {text: '"/login" ', color: S}, {text: 'element=', color: C}, {text: '{<Login />}', color: K}, {text: ' />', color: T}],
	[{text: '          ', color: W}, {text: '<Route ', color: T}, {text: 'path=', color: C}, {text: '"/dashboard" ', color: S}, {text: 'element=', color: C}, {text: '{<Dashboard />}', color: K}, {text: ' />', color: T}],
	[{text: '        ', color: W}, {text: '</Routes>', color: T}],
	[{text: '      ', color: W}, {text: '</BrowserRouter>', color: T}],
	[{text: '    ', color: W}, {text: '</AuthProvider>', color: T}],
	[{text: '  )', color: C}],
	[{text: '}', color: C}],
	[{text: '', color: W}],
	[{text: 'export default App', color: T}],
];
