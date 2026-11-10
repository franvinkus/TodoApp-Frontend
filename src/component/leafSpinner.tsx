interface LeafSpinnerProps {
    message?: string;
}

const LeafSpinner = ({message} : LeafSpinnerProps) => {
    return (
         <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-900/70 backdrop-blur-sm">

            <div className="w-20 h-20 animate-spin" >
                <svg 
                    className="w-9 h-9 text-pink-400 absolute animate-pulse drop-shadow-[0_0_10px_rgba(255,130,175,0.6)]" 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                >
                    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
                    <path d="M2 22 12 12"/>
                </svg>
            </div>

            <p className="mt-5 text-xl font-semibold text-pink-200 animate-pulse tracking-wide">
                {message}
            </p>
        </div>
        );
}

export default LeafSpinner;