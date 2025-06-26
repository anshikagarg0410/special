import React, { useState, useEffect } from 'react';
import AnimatedText from '../components/AnimatedText';
import { HeartIcon, SparkleIcon } from '../components/Icons';

const fullLetter = `To My Cuteuu, On Your Birthday 💌
30th August

My love,

Happy Birthday, my heart.
Every 30th August is special because it brought you into this world — and one day, it brought you into mine.

I don’t know how I got this lucky, but I know what I’ve found in you is rare — someone who makes me feel safe, excited, understood, and endlessly loved.

We’re not rushing anything. We have time — years ahead of us to grow, to       chase dreams, to stumble and rise, together. And even though we talk about     marriage being far away — 8, maybe 9 years — I already know, deep inside,  that it’s you. It’s always been you.

So here it is — my little proposal, wrapped in this letter and in all the love I     have for you:

Will you keep choosing me, again and again, as the years pass?
Will you hold my hand now, and still be holding it when we finally say “yes”    to forever?
Will you be my partner not just in love, but in life, even before the vows?

You don’t need to answer right away. Just smile and hold me like you always do — that’s more than enough.

I love you. More than I can say in any letter.
And I’ll keep loving you, across birthdays, across years, across lifetimes.

Yours —
Today, tomorrow, always,
Anuu💍❤️
`;

const finalQuestionText = "Will you marry me?";

const ProposalPage: React.FC = () => {
  const [letterOpened, setLetterOpened] = useState(false);
  const [showFinalQuestion, setShowFinalQuestion] = useState(false);
  const [showYesNoButtons, setShowYesNoButtons] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [hearts, setHearts] = useState<Array<{ id: number; x: string; y: string; size: string; delay: string; duration: string }>>([]);

  const openLetterAndReveal = () => {
    setLetterOpened(true);
    triggerHeartBurst(10);
  };

  const handleYesChoice = () => {
    setShowYesNoButtons(false);
    setShowCelebration(true);
    triggerHeartBurst(30, true);
  };

  const triggerHeartBurst = (count = 10, isFinal = false) => {
    const newHearts = Array.from({ length: count }).map((_, i) => ({
      id: Date.now() + i + Math.random(),
      x: `${Math.random() * 100}%`,
      y: `${Math.random() * 80 + 10}%`,
      size: `${Math.random() * (isFinal ? 50 : 30) + (isFinal ? 25 : 15)}px`,
      delay: `${Math.random() * (isFinal ? 0.3 : 0.5)}s`,
      duration: `${Math.random() * 2 + (isFinal ? 1.5 : 1)}s`
    }));
    setHearts(prev => [...prev, ...newHearts]);
    setTimeout(() => setHearts([]), isFinal ? 5000 : 3000);
  };

  useEffect(() => {
    let messageTimerId: number | undefined;
    let questionTimerId: number | undefined;

    if (letterOpened && !showCelebration) {
      messageTimerId = window.setTimeout(() => {
        setShowFinalQuestion(true);
        triggerHeartBurst(15);
        questionTimerId = window.setTimeout(() => {
          setShowYesNoButtons(true);
        }, finalQuestionText.length * 100 + 1000);
      }, fullLetter.length * 25 + 1500);
    }
    return () => {
      if (messageTimerId) clearTimeout(messageTimerId);
      if (questionTimerId) clearTimeout(questionTimerId);
    };
  }, [letterOpened, showCelebration]);

  return (
    <div className="py-10 flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center px-4 relative overflow-hidden bg-gradient-to-br from-rose-100 via-pink-100 to-purple-200">
      {hearts.map(heart => (
        <HeartIcon
          key={heart.id}
          className="absolute text-pink-400 opacity-0 animate-heartFloat"
          style={{
            left: heart.x,
            top: heart.y,
            width: heart.size,
            height: heart.size,
            animationDelay: heart.delay,
            animationDuration: heart.duration,
          }}
        />
      ))}

      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <SparkleIcon
            key={`bg-sparkle-${i}`}
            className="absolute text-yellow-300 animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 20 + 10}px`,
              height: `${Math.random() * 20 + 10}px`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${Math.random() * 3 + 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-3xl">
        <h1 className="text-4xl sm:text-5xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-pink-600 to-rose-700 mb-8 py-2 title-shadow">
          <AnimatedText text="A Letter From My Heart..." delay={70} />
        </h1>

        {!letterOpened && (
          <button
            onClick={openLetterAndReveal}
            className="bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 hover:from-pink-600 hover:via-rose-600 hover:to-red-600 text-white font-bold py-4 px-10 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 text-xl focus:outline-none focus:ring-4 focus:ring-rose-300/70 animate-pulse-grow"
          >
            Open Your Special Letter <HeartIcon className="inline-block w-6 h-6 ml-2 mb-1" />
          </button>
        )}

        {letterOpened && (
          <div className="mt-8 bg-white/90 backdrop-blur-md p-6 sm:p-8 rounded-xl shadow-2xl text-left border border-pink-100 animate-letterRevealAll" aria-live="polite">
            <p
              className="text-lg sm:text-xl text-gray-800 leading-relaxed font-[Georgia,serif] italic mb-4 whitespace-pre-line"
              style={{ wordBreak: 'keep-all', overflowWrap: 'break-word' }}
            >
              <AnimatedText text={fullLetter} delay={20} stagger={false} />
            </p>
          </div>
        )}

        {showFinalQuestion && !showCelebration && (
          <div className="mt-12 sm:mt-16 p-8 sm:p-12 bg-gradient-to-br from-white via-rose-100 to-pink-200 backdrop-blur-lg rounded-2xl shadow-xl_strong inline-block animate-finalQuestionPop" aria-live="polite">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-red-700 title-shadow-strong">
              <AnimatedText text={finalQuestionText} delay={100} stagger={true} />
            </h2>
            <HeartIcon className="w-24 h-24 sm:w-32 sm:h-32 text-red-500 mx-auto mt-8 sm:mt-10 animate-heartBeatStrong" />
          </div>
        )}

        {showYesNoButtons && !showCelebration && (
          <div className="mt-10 sm:mt-12 space-y-5 sm:space-y-0 sm:space-x-6 flex flex-col sm:flex-row items-center justify-center animate-popIn-global relative" style={{ minHeight: 100 }}>
            <button
              onClick={handleYesChoice}
              className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-extrabold py-4 px-8 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 text-xl focus:outline-none focus:ring-4 focus:ring-green-400/70 animate-pulse-grow"
            >
              YES! <span className="hidden sm:inline">A thousand times YES!</span> 🎉
            </button>
            <button
              type="button"
              className="w-full sm:w-auto bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-gray-800 font-semibold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-md focus:outline-none focus:ring-4 focus:ring-yellow-300/70 cursor-pointer select-none moving-no-btn"
              style={{ position: 'relative' }}
              onMouseOver={e => {
                const parent = e.currentTarget.parentElement;
                if (!parent) return;
                const btn = e.currentTarget;
                const parentRect = parent.getBoundingClientRect();
                const btnRect = btn.getBoundingClientRect();
                // Calculate new random position within parent
                const maxX = parentRect.width - btnRect.width;
                const maxY = parentRect.height - btnRect.height;
                const randX = Math.random() * maxX;
                const randY = Math.random() * maxY;
                btn.style.transform = `translate(${randX}px, ${randY}px)`;
                btn.style.transition = 'transform 0.25s cubic-bezier(.4,2,.6,1)';
              }}
              onClick={e => e.preventDefault()}
            >
              No 😢
            </button>
          </div>
        )}

        {showCelebration && (
          <div className="mt-12 p-8 bg-white/90 backdrop-blur-md rounded-xl shadow-2xl animate-popIn-global">
            <h3 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-500 to-red-600 mb-4">
              He said YES!!
            </h3>
            <p className="text-xl text-gray-700">
              Our forever starts now! ❤️❤️❤️
            </p>
            <HeartIcon className="w-20 h-20 text-red-500 mx-auto mt-6 animate-heartBeatStrong animate-heartPulse-global" />
          </div>
        )}
      </div>

      <style>{`
        .title-shadow { text-shadow: 2px 2px 6px rgba(236, 72, 153, 0.3); }
        .title-shadow-strong { text-shadow: 3px 3px 8px rgba(225, 29, 72, 0.5); }
        .shadow-xl_strong { box-shadow: 0 25px 50px -12px rgba(219, 39, 119, 0.35), 0 15px 30px -15px rgba(219, 39, 119, 0.25); }
        @keyframes letterRevealAll {
          from { opacity: 0; transform: translateY(30px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-letterRevealAll { animation: letterRevealAll 1s cubic-bezier(0.165, 0.84, 0.44, 1) forwards; }
        @keyframes finalQuestionPop {
          0% { opacity: 0; transform: scale(0.5) rotate(-10deg); }
          70% { opacity: 1; transform: scale(1.1) rotate(3deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        .animate-finalQuestionPop { animation: finalQuestionPop 1.2s cubic-bezier(0.68, -0.6, 0.265, 1.6) forwards; animation-delay: 0.2s; }
        @keyframes pulse-grow {
           0%, 100% { transform: scale(1); box-shadow: 0 10px 20px rgba(219, 39, 119, 0.2); }
           50% { transform: scale(1.05); box-shadow: 0 15px 30px rgba(219, 39, 119, 0.3); }
        }
        .animate-pulse-grow { animation: pulse-grow 2.5s infinite; }
        @keyframes pulse-grow-strong {
           0%, 100% { transform: scale(1); box-shadow: 0 15px 30px rgba(220, 38, 38, 0.3); }
           50% { transform: scale(1.08); box-shadow: 0 20px 40px rgba(220, 38, 38, 0.4); }
        }
        .animate-pulse-grow-strong { animation: pulse-grow-strong 2s infinite; }
        @keyframes heartBeat {
          0%, 100% { transform: scale(1); } 50% { transform: scale(1.2); }
        }
        .animate-heartBeat { animation: heartBeat 1.2s ease-in-out infinite; }
        @keyframes heartBeatStrong {
          0%, 100% { transform: scale(1); }
          10%, 30% { transform: scale(1.05); }
          20%, 40% { transform: scale(1.25); }
          50% {transform: scale(1.15);}
        }
        .animate-heartBeatStrong { animation: heartBeatStrong 1.5s ease-in-out infinite; }
        @keyframes heartFloat {
          0% { opacity: 0; transform: translateY(20px) scale(0.5); }
          20% { opacity: 0.7; }
          80% { opacity: 0.7; transform: translateY(-90px) scale(1.25) rotate(20deg); }
          100% { opacity: 0; transform: translateY(-130px) scale(0.7) rotate(-20deg); }
        }
        .animate-heartFloat { animation-name: heartFloat; animation-timing-function: ease-out; animation-fill-mode: forwards; }
        @keyframes popInGlobal {
            0% { opacity: 0; transform: scale(0.8); }
            80% { opacity: 1; transform: scale(1.05); }
            100% { opacity: 1; transform: scale(1); }
        }
        .animate-popIn-global {
            animation: popInGlobal 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        @keyframes fadeInUpGlobal {
            from { opacity: 0; transform: translateY(25px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp-global {
            animation: fadeInUpGlobal 0.6s ease-out forwards;
        }
        .moving-no-btn {
          z-index: 10;
        }
      `}</style>
    </div>
  );
};

export default ProposalPage;
