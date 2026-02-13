# Project: Structured Knowledge Collaboration Platform

(Notion × Obsidian × StackOverflow × Research Hub)

---

## 🎯 Mission

Build a scalable SaaS platform for collaborative structured knowledge creation with:

- Public & Private groups
- Role-based permissions (enterprise grade RBAC)
- Nested topics (Obsidian-style tree)
- Accordion Q&A blocks (LaTeX supported)
- Markdown editor
- PDF upload + annotation
- Audit logs
- Invite system with secure tokens
- Notion-like clean UI

---

# 🏗 SYSTEM ARCHITECTURE

## Stack

Frontend:

- React (Vite)
- TypeScript
- TailwindCSS
- Framer Motion
- dnd-kit
- react-markdown
- remark-math
- rehype-katex

Backend:

- Node.js (Express)
- TypeScript

Database & Infra:

- Supabase (Auth + Postgres + Storage)
- RLS enabled on all tables
- Vercel hosting

---

# 🧠 CORE DOMAINS

## 1️⃣ Authentication

- Supabase Auth
- Email login
- OAuth optional
- JWT verification in Node

---

## 2️⃣ Groups

Groups can be:

- Public
- Private (invite-only)

Group properties:

- name
- description
- visibility
- owner_id
- allow_member_invites

---

## 3️⃣ RBAC Permission System

Tables:

roles
permissions
role_permissions
group_members

Permissions examples:

- create_topic
- edit_topic
- delete_topic
- create_accordion
- edit_accordion
- delete_accordion
- upload_material
- annotate_material
- create_invite
- manage_roles
- delete_group

Permission check must occur:

- In Node middleware
- Enforced with Supabase RLS

Frontend permission checks are UI-only.

---

## 4️⃣ Topics (Nested Pages)

Support:

- Parent-child nesting
- Drag and drop reordering
- Collapsible tree UI
- Markdown content body

---

## 5️⃣ Accordion System

Each topic can contain multiple accordion blocks.

Must support:

- Markdown
- LaTeX
- Smooth animation
- Reordering
- Auto-save
- Permission enforcement
- Audit logging

---

## 6️⃣ Invite System

Invite tokens:

- 32+ char crypto random
- Expiry date
- Usage limit
- Assigned role
- Optional approval required

---

## 7️⃣ Audit Logs

Track:

- Role changes
- Topic deletion
- Accordion edits
- Invite usage
- Member removal

---

## 8️⃣ UI Design Language

Design style:

- Minimal
- Soft gray backgrounds
- Rounded-xl / rounded-2xl
- Gold accent for active states
- Dark mode default
- Inter font

Layout:
Left sidebar → Groups
Middle sidebar → Topic tree
Main content → Editor & Accordions
Right panel → Members & Activity

---

# 🔐 SECURITY REQUIREMENTS

- RLS enabled everywhere
- Private groups not searchable
- Signed URLs for file access
- All destructive actions logged
- Rate limiting on invites

---

# ⚡ PERFORMANCE

- Lazy load topics
- Virtualize accordion lists
- Debounced saves
- Indexed DB caching for large trees

---

# 🧱 FOLDER STRUCTURE

Frontend:

```
src/
  components/
  features/
    groups/
    topics/
    accordions/
    permissions/
  services/
  hooks/
  utils/
```

Backend:

```
src/
  controllers/
  middleware/
  services/
  routes/
  permissions/
  audit/
```

---

# 🧩 ACCEPTANCE CRITERIA

✔ Groups support public & private
✔ Invite links secure
✔ RBAC granular
✔ Nested topics functional
✔ Accordion fully interactive
✔ Markdown + LaTeX rendering
✔ Audit logs working
✔ Mobile responsive
✔ Dark mode
✔ Scalable architecture
