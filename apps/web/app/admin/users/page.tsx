async function getUsers() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://api:3001';
  const res = await fetch(`${base}/api/admin/users`, { cache: 'no-store' });
  return res.json();
}

export default async function AdminUsersPage() {
  const list = await getUsers();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">کاربران</h1>
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-50">
            <th className="p-2">نام</th>
            <th className="p-2">ایمیل</th>
            <th className="p-2">نقش</th>
          </tr>
        </thead>
        <tbody>
          {list.map((u: any) => (
            <tr key={u.id} className="border-t">
              <td className="p-2">{u.name} {u.family}</td>
              <td className="p-2">{u.email}</td>
              <td className="p-2">{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
