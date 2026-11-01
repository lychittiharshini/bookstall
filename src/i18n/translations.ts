export interface TranslationKeys {
  shopName: string;
  shopSubtitle: string;
  heroSentence: string;
  selectTheService: string;
  selectServiceSubtitle: string;
  xeroxPrinting: string;
  xeroxDesc: string;
  booksStationery: string;
  stationeryDesc: string;
  fancyItems: string;
  fancyDesc: string;
  backToServices: string;
  backToHome: string;
  ourGallery: string;
  gallerySubtitle: string;
  galleryEmptyTitle: string;
  galleryEmptyDesc: string;
  shopLocation: string;
  locationSubtitle: string;
  getDirections: string;
  addressLabel: string;
  contactLabel: string;
  openingHoursLabel: string;
  footerMotto: string;
  adminLogin: string;
  rateUponRequest: string;
  specialInstructionsTitle: string;
  specialInstructionsPlaceholder: string;
  reviewRequest: string;
  yourSelectedItems: string;
  selectedServicesLabel: string;
  sendThroughWhatsApp: string;
  whatsappMessageSent: string;
  quantity: string;
  remove: string;
  total: string;
  subtotal: string;
  itemAvailable: string;
  outOfStock: string;
  allCategories: string;
  searchPlaceholder: string;
  filterBy: string;
  featured: string;
  close: string;
  save: string;
  cancel: string;
  delete: string;
  edit: string;
  add: string;
  bwXerox: string;
  colorXerox: string;
  printing: string;
  lamination: string;
  singleSide: string;
  doubleSide: string;
  bwPrinting: string;
  colorPrinting: string;
  // Additional keys for Cart, Checkout, and Offers
  yourCart: string;
  emptyCart: string;
  emptyCartSub: string;
  priceOnRequest: string;
  askForPrice: string;
  estimatedPriceNote: string;
  proceedToCheckout: string;
  proceedWithXeroxOrder: string;
  checkoutTitle: string;
  customerName: string;
  customerMobile: string;
  orderPreference: string;
  storePickup: string;
  localDelivery: string;
  orderNotes: string;
  orderNotesPlaceholder: string;
  placeOrderWhatsApp: string;
  orderSummary: string;
  orderSuccessTitle: string;
  orderSuccessMsg: string;
  orderIdLabel: string;
  openWhatsAppAgain: string;
  copyOrderDetails: string;
  copied: string;
  offersSpecials: string;
  offersSubtitle: string;
}

export const translations: Record<'en' | 'te', TranslationKeys> = {
  en: {
    shopName: 'SREE DURGA MATA STATIONERY',
    shopSubtitle: 'BOOK STALL & FANCY ITEMS',
    heroSentence: 'Serving students, schools, colleges, and families with quality books, Xerox, digital prints, and fancy accessories in Hyderabad.',
    selectTheService: 'SELECT THE SERVICE',
    selectServiceSubtitle: 'Choose an option to place an order or enquiry.',
    xeroxPrinting: 'XEROX & PRINTING',
    xeroxDesc: 'Black & white photocopy, color laser copies, document printing, and thermal lamination.',
    booksStationery: 'BOOKS & STATIONERY',
    stationeryDesc: 'School textbooks, note books, Classmate registers, pens, drawing kits, and office stationery.',
    fancyItems: 'FANCY ITEMS',
    fancyDesc: 'Velvet bangles, sparkling jhumkas, designer bindis, hair clutches, and hair bands.',
    backToServices: '← Back to Services',
    backToHome: '← Back to Home',
    ourGallery: 'OUR GALLERY',
    gallerySubtitle: 'Photographs of our shop, books, machines, and collections',
    galleryEmptyTitle: 'Gallery Photos Coming Soon',
    galleryEmptyDesc: 'Photographs uploaded by the store owner will appear here.',
    shopLocation: 'SHOP LOCATION',
    locationSubtitle: 'H. No. 69, Ilapur Rd, Durgamata Colony, Tanda, Hyderabad, Telangana 502032',
    getDirections: 'GET DIRECTIONS',
    addressLabel: 'Address',
    contactLabel: 'Phone & WhatsApp',
    openingHoursLabel: 'Opening Hours',
    footerMotto: 'Serving our community with books, stationery, Xerox and fancy items.',
    adminLogin: 'Admin Login',
    rateUponRequest: 'Rate Upon Request',
    specialInstructionsTitle: 'Any Special Instructions or Notes?',
    specialInstructionsPlaceholder: 'Mention page range (e.g. 1-10), double sided, spiral binding, delivery note, or any question...',
    reviewRequest: 'REVIEW REQUEST',
    yourSelectedItems: 'YOUR SELECTED ITEMS',
    selectedServicesLabel: 'Your Selected Services:',
    sendThroughWhatsApp: 'SEND THROUGH WHATSAPP',
    whatsappMessageSent: 'Opening WhatsApp with your request...',
    quantity: 'Quantity',
    remove: 'Remove',
    total: 'Total',
    subtotal: 'Known Subtotal',
    itemAvailable: 'In Stock',
    outOfStock: 'Out of Stock',
    allCategories: 'All Categories',
    searchPlaceholder: 'Search items...',
    filterBy: 'Filter by Category',
    featured: 'Featured',
    close: 'Close',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add New',
    bwXerox: 'BLACK & WHITE XEROX',
    colorXerox: 'COLOUR XEROX',
    printing: 'PRINTING',
    lamination: 'LAMINATION',
    singleSide: 'Single Side',
    doubleSide: 'Double Side',
    bwPrinting: 'Black & White Printing',
    colorPrinting: 'Colour Printing',
    yourCart: 'Your Shopping Cart',
    emptyCart: 'Your cart is empty',
    emptyCartSub: 'Explore our services to add items.',
    priceOnRequest: 'Rate Upon Request',
    askForPrice: 'Rate Upon Request',
    estimatedPriceNote: '* Rates subject to confirmation upon WhatsApp submission.',
    proceedToCheckout: 'PROCEED TO CHECKOUT',
    proceedWithXeroxOrder: 'PROCEED WITH XEROX',
    checkoutTitle: 'Complete Your Order via WhatsApp',
    customerName: 'Your Full Name *',
    customerMobile: 'Mobile / WhatsApp Number *',
    orderPreference: 'Delivery / Pickup Preference',
    storePickup: 'Store Pickup',
    localDelivery: 'Local Delivery',
    orderNotes: 'Notes / Special Requests',
    orderNotesPlaceholder: 'Mention any instructions...',
    placeOrderWhatsApp: 'SEND THROUGH WHATSAPP',
    orderSummary: 'Order Summary',
    orderSuccessTitle: 'Request Sent Successfully!',
    orderSuccessMsg: 'Your order details have been formatted for WhatsApp.',
    orderIdLabel: 'Order ID',
    openWhatsAppAgain: 'Open WhatsApp',
    copyOrderDetails: 'Copy Details',
    copied: 'Copied!',
    offersSpecials: 'FESTIVAL SPECIALS & OFFERS',
    offersSubtitle: 'Exclusive offers on stationery and fancy items',
  },
  te: {
    shopName: 'శ్రీ దుర్గా మాత స్టేషనరీ',
    shopSubtitle: 'బుక్ స్టాల్ & ఫ్యాన్సీ ఐటమ్స్',
    heroSentence: 'పాఠశాల, కాలేజీ పుస్తకాలు, నోట్‌బుక్స్, జిరాక్స్, ప్రింటింగ్ మరియు ఫ్యాన్సీ వస్తువుల కోసం మీ విశ్వసనీయ దుకాణం.',
    selectTheService: 'సేవను ఎంచుకోండి',
    selectServiceSubtitle: 'ఆర్డర్ లేదా విచారణ కోసం క్రింది విభాగాలలో ఒకదాన్ని ఎంచుకోండి.',
    xeroxPrinting: 'జిరాక్స్ & ప్రింటింగ్',
    xeroxDesc: 'బ్లాక్ & వైట్ జిరాక్స్, కలర్ జిరాక్స్, డాక్యుమెంట్ ప్రింటింగ్ మరియు లామినేషన్ సేవలు.',
    booksStationery: 'పుస్తకాలు & స్టేషనరీ',
    stationeryDesc: 'స్కూల్ పుస్తకాలు, నోట్‌బుక్స్, పెన్నులు, డ్రాయింగ్ వస్తువులు మరియు ఆఫీస్ ఫైల్స్.',
    fancyItems: 'ఫ్యాన్సీ ఐటమ్స్',
    fancyDesc: 'గాజులు, జుంకాలు, స్టిక్కర్ బొట్లు, హెయిర్ క్లిప్స్ మరియు మహిళల అలంకరణ వస్తువులు.',
    backToServices: '← సేవల జాబితాకు తిరిగి వెళ్లండి',
    backToHome: '← హోమ్‌కు తిరిగి వెళ్లండి',
    ourGallery: 'మా గ్యాలరీ',
    gallerySubtitle: 'మా దుకాణం మరియు ఉత్పత్తుల ఛాయాచిత్రాలు',
    galleryEmptyTitle: 'గ్యాలరీ ఫోటోలు త్వరలో చేర్చబడతాయి',
    galleryEmptyDesc: 'షాప్ యజమాని అప్‌లోడ్ చేసిన ఛాయాచిత్రాలు ఇక్కడ కనిపిస్తాయి.',
    shopLocation: 'దుకాణం చిరునామా',
    locationSubtitle: 'H. No. 69, ఇలాపూర్ రోడ్, దుర్గామాత కాలనీ, తండా, హైదరాబాద్, తెలంగాణ 502032',
    getDirections: 'గూగుల్ మ్యాప్స్‌లో దారి చూడండి',
    addressLabel: 'చిరునామా',
    contactLabel: 'ఫోన్ & వాట్సాప్',
    openingHoursLabel: 'దుకాణం వేళలు',
    footerMotto: 'పుస్తకాలు, స్టేషనరీ, జిరాక్స్ మరియు ఫ్యాన్సీ వస్తువులతో ప్రజలకు నమ్మకమైన సేవ.',
    adminLogin: 'అడ్మిన్ లాగిన్',
    rateUponRequest: 'రేటు అడిగి తెలుసుకోండి',
    specialInstructionsTitle: 'ఏవైనా ప్రత్యేక సూచనలు లేదా నోట్స్ ఉన్నాయా?',
    specialInstructionsPlaceholder: 'పేజీల వివరాలు (ఉదా. 1 నుండి 10), బైండింగ్, లేదా ఏవైనా అదనపు వివరాలను ఇక్కడ రాయండి...',
    reviewRequest: 'మీరు ఎంచుకున్న వివరాలు (సమీక్షించండి)',
    yourSelectedItems: 'మీరు ఎంచుకున్న వస్తువులు',
    selectedServicesLabel: 'మీరు ఎంచుకున్న సేవలు:',
    sendThroughWhatsApp: 'వాట్సాప్ ద్వారా పంపండి',
    whatsappMessageSent: 'మీ వివరాలతో వాట్సాప్ తెరవబడుతోంది...',
    quantity: 'పరిమాణం',
    remove: 'తొలగించు',
    total: 'మొత్తం',
    subtotal: 'తెలిసిన ధరల మొత్తం',
    itemAvailable: 'స్టాక్ ఉంది',
    outOfStock: 'స్టాక్ లేదు',
    allCategories: 'అన్ని విభాగాలు',
    searchPlaceholder: 'వెతకండి...',
    filterBy: 'విభాగాల వారిగా',
    featured: 'ప్రధానమైనవి',
    close: 'మూసివేయి',
    save: 'సేవ్ చేయి',
    cancel: 'రద్దు చేయి',
    delete: 'తొలగించు',
    edit: 'సవరించు',
    add: 'కొత్తది జోడించు',
    bwXerox: 'బ్లాక్ & వైట్ జిరాక్స్',
    colorXerox: 'రంగుల జిరాక్స్',
    printing: 'ప్రింటింగ్',
    lamination: 'లామినేషన్',
    singleSide: 'ఒక వైపు (సింగిల్ సైడ్)',
    doubleSide: 'రెండు వైపులా (డబుల్ సైడ్)',
    bwPrinting: 'బ్లాక్ & వైట్ ప్రింటింగ్',
    colorPrinting: 'రంగుల ప్రింటింగ్',
    yourCart: 'మీ షాపింగ్ కార్ట్',
    emptyCart: 'మీ కార్ట్ ఖాళీగా ఉంది',
    emptyCartSub: 'వస్తువులను ఎంచుకుని జోడించండి.',
    priceOnRequest: 'రేటు అడిగి తెలుసుకోండి',
    askForPrice: 'రేటు అడిగి తెలుసుకోండి',
    estimatedPriceNote: '* వాట్సాప్‌లో షాప్ యజమాని తుది రేటును నిర్ధారిస్తారు.',
    proceedToCheckout: 'ఆర్డర్ చెక్అవుట్',
    proceedWithXeroxOrder: 'జిరాక్స్ ఆర్డర్‌ను జోడించండి',
    checkoutTitle: 'వాట్సాప్ ద్వారా ఆర్డర్ పూర్తి చేయండి',
    customerName: 'మీ పూర్తి పేరు *',
    customerMobile: 'మొబైల్ / వాట్సాప్ నంబర్ *',
    orderPreference: 'డెలివరీ / పికప్ విధానం',
    storePickup: 'షాప్ వద్ద పికప్',
    localDelivery: 'స్థానిక డెలివరీ',
    orderNotes: 'ఆర్డర్ నోట్స్ / వివరాలు',
    orderNotesPlaceholder: 'ప్రత్యేక సూచనలను ఇక్కడ రాయండి...',
    placeOrderWhatsApp: 'వాట్సాప్ ద్వారా పంపండి',
    orderSummary: 'ఆర్డర్ వివరాలు',
    orderSuccessTitle: 'విజయవంతంగా నమోదైంది!',
    orderSuccessMsg: 'మీ వివరాలతో వాట్సాప్ తెరవబడుతోంది.',
    orderIdLabel: 'ఆర్డర్ ఐడి',
    openWhatsAppAgain: 'వాట్సాప్ తెరవండి',
    copyOrderDetails: 'వివరాలు కాపీ చేయండి',
    copied: 'కాపీ చేయబడింది!',
    offersSpecials: 'ఆఫర్లు & పండుగ స్పెషల్స్',
    offersSubtitle: 'ప్రత్యేక రాయితీలు మరియు ఆఫర్లు',
  },
};
