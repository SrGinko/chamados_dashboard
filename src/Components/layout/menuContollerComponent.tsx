export default function MenuController() {
    const electronAPI = window.electronAPI

    return (
        <div className="menuController">

            <div style={{ display: 'flex', alignItems: "center", justifyContent: 'center', gap: 6 }}>
                <img src="https://zzggbdfcndfwdunphupw.supabase.co/storage/v1/object/public/System%20Icons/Vero/bannelogo.png" width={64} height={42} /><b style={{ fontSize: 12 }}>Dashboard</b>
            </div>
            <div className="btnControllerContainer">
                <div className="btn minimize" onClick={() => electronAPI?.minimize()}></div>
                <div className="btn maximize" onClick={() => electronAPI?.maximize()}></div>
                <div className="btn close" onClick={() => electronAPI?.close()}></div>
            </div>
        </div>
    )
}
