import { useState } from 'react'

export function Login() {
  const [password, setPassword] = useState('')

  const handleClick = () => {
    if (password === 'origin5') {
      sessionStorage.setItem('token', 'confirmed')
      sessionStorage.setItem('expiresAt', new Date().getTime() + 60 * 60 * 1000)
      location.href = '/'
    }
  }
  return (
    <div className="fixed left-1/2 top-1/2 z-50 block h-full w-full -translate-x-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm">
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="shadow-white-700 z-10 flex w-[350px] justify-between rounded bg-white shadow-md shadow-slate-900">
          <div className="m-4">
            <input
              type="password"
              className="w-full border px-2 py-1 text-lg placeholder-gray-400 focus:ring-0 focus:ring-offset-0"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Access Code"
            />
          </div>
          <div className="m-4">
            <button
              className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-900"
              onClick={handleClick}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
