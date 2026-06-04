import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "nav": {
        "home": "Home",
        "about": "About",
        "programs": "Programs",
        "transformations": "Transformations",
        "contact": "Contact",
        "language": "عربي"
      },
      "hero": {
        "subtitle": "[ BE YOURSELF ]",
        "title": "COACH\nAHMED RAGAB\nTHE BEST VERSION",
        "quote": "\"Just like I helped them change their lifestyle, live a healthy life, and become the best version of yourself.\"",
        "subscribe": "SUBSCRIBE NOW"
      },
      "about": {
        "title": "WHO IS",
        "titleSpan": "COACH RAGAB?",
        "desc": "An internationally certified personal trainer specializing in body rebuilding and achieving real transformations through meticulously designed, scientifically based training systems.",
        "stats": {
          "clients": "CLIENTS",
          "experience": "YEARS EXPERIENCE",
          "support": "SUPPORT",
          "packages": "COACHING PACKAGES"
        }
      },
      "packages": {
        "title": "COACHING PACKAGES",
        "nutrition": "NUTRITION PLAN",
        "training": "TRAINING & WORKOUT",
        "vip": "VIP MEMBERSHIPS",
        "subscribe": "Subscribe Now",
        "bestValue": "BEST VALUE"
      },
      "checkout": {
        "title": "Complete Your Subscription",
        "name": "Full Name",
        "email": "Email Address",
        "phone": "WhatsApp Number",
        "payment": "Payment Method",
        "submit": "Confirm Payment",
        "cancel": "Cancel",
        "success": "Subscription successful! Coach Ragab will contact you shortly."
      },
      "bmi": {
        "title": "CALCULATE YOUR BMI",
        "weight": "Weight (kg)",
        "height": "Height (cm)",
        "calculate": "Calculate",
        "result": "Your BMI is: "
      },
      "subscribeSteps": {
        "title": "HOW TO SUBSCRIBE",
        "step1": "Choose your package and submit the form.",
        "step2": "Complete the payment process.",
        "step3": "Start your transformation journey."
      },
      "champions": {
        "subtitle": "REAL RESULTS",
        "title": "Our Champions",
        "desc": "See the transformations of people who committed to the training plan.",
        "lost": "Lost",
        "in": "in",
        "more": "MORE TRANSFORMATIONS"
      },
      "program": {
        "title": "YOUR PROGRAM INCLUDES",
        "desc": "Everything you need to reach your fitness goals is included in your coaching package.",
        "f1": "Weekly check-ins and adjustments",
        "f2": "Customized diet plans",
        "f3": "Workout routines",
        "f4": "Supplement guidance",
        "f5": "Progress tracking",
        "f6": "24/7 Support"
      },
      "footer": {
        "desc": "Transform your body and mind with Coach Ahmed Ragab. Join the team today.",
        "copyright": "© 2026 Coach Ahmed Ragab. All rights reserved.",
        "quickLinks": "Quick Links",
        "contactUs": "Contact Us",
        "social": "Follow Us"
      },
      "faq": {
        "title": "Questions",
        "q1": "Do I need to go to a gym?",
        "a1": "Not necessarily. We can design a customized home workout plan that fits your available equipment.",
        "q2": "Can I eat the foods I love?",
        "a2": "Yes! Our nutrition plans are flexible and include your favorite foods in moderation to ensure long-term consistency.",
        "q3": "How do we communicate?",
        "a3": "Communication is done directly via WhatsApp for daily support, check-ins, and adjustments to your plan.",
        "q4": "Are the plans suitable for beginners?",
        "a4": "Absolutely. Every plan is tailored to your current fitness level, whether you are a complete beginner or an advanced athlete."
      }
    }
  },
  ar: {
    translation: {
      "nav": {
        "home": "الرئيسية",
        "about": "عني",
        "programs": "البرامج",
        "transformations": "التحولات",
        "contact": "تواصل معايا",
        "language": "English"
      },
      "hero": {
        "subtitle": "[ خليك نفسك ]",
        "title": "كابتن أحمد رجب\nأحسن نسخة منك",
        "quote": "\"زي ما ساعدتهم يغيروا حياتهم ويعيشوا صح، هساعدك تبقى أحسن نسخة من نفسك.\"",
        "subscribe": "اشترك دلوقتي"
      },
      "about": {
        "title": "مين هو",
        "titleSpan": "كابتن رجب؟",
        "desc": "مدرب شخصي معتمد دولياً متخصص في تظبيط الجسم وتحقيق نتايج حقيقية بأنظمة متفصلة ليك ومبنية على أسس علمية.",
        "stats": {
          "clients": "عميل",
          "experience": "سنين خبرة",
          "support": "دعم متواصل",
          "packages": "باقات التدريب"
        }
      },
      "packages": {
        "title": "باقات التدريب",
        "nutrition": "نظام الأكل",
        "training": "التدريب والتمرين",
        "vip": "عضوية الـ VIP",
        "subscribe": "اشترك دلوقتي",
        "bestValue": "أحسن قيمة"
      },
      "checkout": {
        "title": "كمل اشتراكك",
        "name": "الاسم بالكامل",
        "email": "الإيميل",
        "phone": "رقم الواتساب",
        "payment": "طريقة الدفع",
        "submit": "أكد الدفع",
        "cancel": "إلغاء",
        "success": "اشتركت بنجاح! هنتواصل معاك قريب."
      },
      "bmi": {
        "title": "احسب نسبة الدهون والكتلة (BMI)",
        "weight": "الوزن (كجم)",
        "height": "الطول (سم)",
        "calculate": "احسب",
        "result": "مؤشر كتلة جسمك هو: "
      },
      "subscribeSteps": {
        "title": "إزاي تشترك",
        "step1": "اختار باقتك واملى الاستمارة.",
        "step2": "كمل عملية الدفع.",
        "step3": "ابدأ رحلة التغيير بتاعتك."
      },
      "champions": {
        "subtitle": "نتايج حقيقية",
        "title": "أبطالنا",
        "desc": "شوف تحولات الناس اللي التزمت بالخطة.",
        "lost": "خس",
        "in": "في",
        "more": "شوف تحولات تانية"
      },
      "program": {
        "title": "برنامجك فيه إيه؟",
        "desc": "كل حاجة محتاجها عشان توصل لهدفك موجودة في الباقة.",
        "f1": "متابعة وتعديلات كل أسبوع",
        "f2": "أنظمة أكل متفصلة ليك",
        "f3": "خطط تمرين احترافية",
        "f4": "توجيهات للمكملات",
        "f5": "متابعة مستمرة لتقدمك",
        "f6": "دعم طول اليوم"
      },
      "footer": {
        "desc": "غير جسمك وعقلك مع كابتن أحمد رجب. انضم للفريق النهاردة.",
        "copyright": "© 2026 كابتن أحمد رجب. جميع الحقوق محفوظة.",
        "quickLinks": "روابط سريعة",
        "contactUs": "تواصل معايا",
        "social": "تابعنا"
      },
      "faq": {
        "title": "الأسئلة",
        "q1": "لازم أروح جيم؟",
        "a1": "مش شرط خالص. ممكن نعمّلك خطة تمرين في البيت تناسب الأدوات اللي عندك.",
        "q2": "ممكن آكل الأكل اللي بحبه؟",
        "a2": "أكيد! أنظمة الأكل بتاعتنا مرنة وفيها الأكل اللي بتحبه بس باعتدال عشان تقدر تستمر.",
        "q3": "هنتواصل إزاي؟",
        "a3": "التواصل كله بيبقى دايركت على الواتساب للمتابعة اليومية وتعديلات الخطة.",
        "q4": "هل الخطط دي تنفع للمبتدئين؟",
        "a4": "طبعاً. كل خطة بتتفصل على مستواك الحالي، سواء لسه بتبدأ أو رياضي متقدم."
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", 
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
