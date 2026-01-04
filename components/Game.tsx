export const GameOverScreen = ({
  score,
  voucherCode,
  user,
  onOpenAuth,
  onPlayAgain,
  emailStatus,
  onResendEmail,
}: any) => {
  const { t } = useContext(LanguageContext);

  // ✅ Update leaderboard whenever game ends (win/lose), as long as user exists
  useEffect(() => {
    if (user) updateLeaderboard(score, user, db, appId);
  }, [user, score]);

  return (
    <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl z-30 flex flex-col items-center justify-center text-center p-6 animate-in fade-in zoom-in duration-300">
      {voucherCode ? (
        <>
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-500 blur-3xl opacity-20 animate-pulse"></div>
            <Trophy size={64} className="text-yellow-400 mb-6 animate-bounce relative z-10" />
          </div>

          <h3 className="text-4xl font-black text-white mb-2 tracking-tight">
            {t('you_won')}
          </h3>

          <p className="text-slate-300 mb-8 text-lg">
            {t('you_scored')} <span className="text-white font-bold">{score}</span> points!
          </p>

          <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 p-6 rounded-2xl w-full max-w-sm border-2 border-yellow-500/50 border-dashed mb-8 relative overflow-hidden transform hover:scale-105 transition-transform">
            <p className="text-xs font-bold text-yellow-500 uppercase tracking-[0.2em] mb-2">
              {t('voucher_code')}
            </p>
            <p className="text-3xl font-mono font-black text-white tracking-wider drop-shadow-lg">
              {voucherCode}
            </p>
          </div>

          {user ? (
            <div className="flex flex-col items-center w-full mb-8 space-y-3">
              {emailStatus === 'sending' && (
                <div className="flex items-center gap-2 text-yellow-400 bg-yellow-400/10 px-5 py-2.5 rounded-full border border-yellow-400/20 animate-pulse">
                  <Loader size={18} className="animate-spin" />
                  <span className="text-sm font-bold">{t('sending')}</span>
                </div>
              )}

              {emailStatus === 'sent' && (
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-2 text-green-400 bg-green-400/10 px-5 py-2.5 rounded-full border border-green-400/20">
                    <CheckCircle size={18} />
                    <span className="text-sm font-bold">
                      {t('sent_to')} {user.email || 'your email'}
                    </span>
                  </div>
                </div>
              )}

              {emailStatus === 'error' && (
                <button
                  onClick={onResendEmail}
                  className="flex items-center gap-2 text-red-300 bg-red-500/10 px-5 py-2.5 rounded-full border border-red-400/20 hover:bg-red-500/20 transition-colors"
                >
                  <RefreshCw size={18} />
                  <span className="text-sm font-bold">{t('retry')}</span>
                </button>
              )}

              {emailStatus === 'idle' && (
                <button
                  onClick={onResendEmail}
                  className="flex items-center gap-2 text-blue-300 bg-blue-500/10 px-5 py-2.5 rounded-full border border-blue-400/20 hover:bg-blue-500/20 transition-colors"
                >
                  <Mail size={18} />
                  <span className="text-sm font-bold">{t('email_voucher')}</span>
                </button>
              )}
            </div>
          ) : null}
        </>
      ) : (
        <>
          <Clock size={64} className="text-slate-600 mb-6" />
          <h3 className="text-4xl font-black text-white mb-2">{t('times_up')}</h3>
          <p className="text-slate-400 mb-8 text-lg">
            {t('you_scored')}{' '}
            <span className="text-yellow-400 font-bold text-2xl mx-1">{score}</span> points.
          </p>
        </>
      )}

      <button
        onClick={() => {
          playSound('click');
          onPlayAgain();
        }}
        className="px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg rounded-full shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_50px_rgba(6,182,212,0.6)] hover:scale-105 transition-all duration-300"
      >
        {t('play_again')}
      </button>
    </div>
  );
};
