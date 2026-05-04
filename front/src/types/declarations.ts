
/* eslint-disable */


export type userInp = {
  avatar?: number | fileInp
  national_card?: number | fileInp
  province?: number | provinceInp
  city?: number | cityInp
  uploadedAssets?: number | fileInp
  reports?: number | reportInp
  blogPosts?: number | blogPostInp
}


export type userSchema = {
  _id?: string;
  first_name: string;
  last_name: string;
  father_name?: string;
  gender: ("Male" | "Female");
  birth_date?: Date;
  summary?: string;
  address?: string;
  level: ("Ghost" | "Manager" | "Editor" | "Ordinary");
  email: string;
  is_verified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  avatar?: {
    _id?: string;
    name: string;
    mimeType: string;
    type: ("image" | "video" | "docs");
    alt_text?: string;
  };
  national_card?: {
    _id?: string;
    name: string;
    mimeType: string;
    type: ("image" | "video" | "docs");
    alt_text?: string;
  };
  province?: {
    _id?: string;
    name: string;
    english_name: string;
  };
  city?: {
    _id?: string;
    name: string;
    english_name: string;
  };
  uploadedAssets: {
    _id?: string;
    name: string;
    mimeType: string;
    type: ("image" | "video" | "docs");
    alt_text?: string;
  }[];
  reports: {
    _id?: string;
    title: string;
    description: string;
    location?: {
      type: "Point";
      coordinates: any[];
    };
    address?: string;
    status: ("Pending" | "Approved" | "Rejected" | "InReview");
    priority?: ("Low" | "Medium" | "High");
    selected_language: ("en" | "zh" | "hi" | "es" | "fr" | "ar" | "pt" | "ru" | "ja" | "pa" | "de" | "id" | "te" | "mr" | "tr" | "ta" | "vi" | "ko" | "it" | "fa" | "nl" | "sv" | "pl" | "uk" | "ro");
    crime_occurred_at: Date;
  }[];
  blogPosts: {
    _id?: string;
    title: string;
    slug: string;
    content: string;
    isPublished: boolean;
    isFeatured: boolean;
    publishedAt?: string;
  }[];
};
;


export type fileInp = {
  uploader?: number | userInp

}


export type fileSchema = {
  _id?: string;
  name: string;
  mimeType: string;
  size: number;
  type: ("image" | "video" | "docs");
  alt_text?: string;
  createdAt?: Date;
  updatedAt?: Date;
  uploader: {
    _id?: string;
    first_name: string;
    last_name: string;
    gender: ("Male" | "Female");
    address?: string;
    level: ("Ghost" | "Manager" | "Editor" | "Ordinary");
    email: string;
    is_verified: boolean;
  };
};
;


export type provinceInp = {
  registrar?: number | userInp
  country?: number | countryInp
  users?: number | userInp
  cities?: number | cityInp
  capital?: number | cityInp
  attackedByReports?: number | reportInp
}


export type provinceSchema = {
  _id?: string;
  name: string;
  english_name: string;
  createdAt?: Date;
  updatedAt?: Date;
  wars_history: string;
  conflict_timeline: string;
  casualties_info: string;
  notable_battles: string;
  occupation_info: string;
  destruction_level: string;
  civilian_impact: string;
  mass_graves_info: string;
  war_crimes_events: string;
  liberation_info: string;
  registrar?: {
    _id?: string;
    first_name: string;
    last_name: string;
    gender: ("Male" | "Female");
    address?: string;
    level: ("Ghost" | "Manager" | "Editor" | "Ordinary");
    email: string;
    is_verified: boolean;
  };
  country: {
    _id?: string;
    name: string;
    english_name: string;
    createdAt?: Date;
    updatedAt?: Date;
    wars_history: string;
    conflict_timeline: string;
    casualties_info: string;
    international_response: string;
    war_crimes_documentation: string;
    human_rights_violations: string;
    genocide_info: string;
    chemical_weapons_info: string;
    displacement_info: string;
    reconstruction_status: string;
    international_sanctions: string;
    notable_war_events: string;
  }[];
  users: {
    _id?: string;
    first_name: string;
    last_name: string;
    gender: ("Male" | "Female");
    address?: string;
    level: ("Ghost" | "Manager" | "Editor" | "Ordinary");
    email: string;
    is_verified: boolean;
  }[];
  cities: {
    _id?: string;
    name: string;
    english_name: string;
    createdAt?: Date;
    updatedAt?: Date;
    wars_history: string;
    conflict_timeline: string;
    casualties_info: string;
    notable_battles: string;
    occupation_info: string;
    destruction_level: string;
    civilian_impact: string;
    mass_graves_info: string;
    war_crimes_events: string;
    liberation_info: string;
  }[];
  capital: {
    _id?: string;
    name: string;
    english_name: string;
    createdAt?: Date;
    updatedAt?: Date;
    wars_history: string;
    conflict_timeline: string;
    casualties_info: string;
    notable_battles: string;
    occupation_info: string;
    destruction_level: string;
    civilian_impact: string;
    mass_graves_info: string;
    war_crimes_events: string;
    liberation_info: string;
  }[];
  attackedByReports: {
    _id?: string;
    title: string;
    description: string;
    location?: {
      type: "Point";
      coordinates: any[];
    };
    address?: string;
    status: ("Pending" | "Approved" | "Rejected" | "InReview");
    priority?: ("Low" | "Medium" | "High");
    selected_language: ("en" | "zh" | "hi" | "es" | "fr" | "ar" | "pt" | "ru" | "ja" | "pa" | "de" | "id" | "te" | "mr" | "tr" | "ta" | "vi" | "ko" | "it" | "fa" | "nl" | "sv" | "pl" | "uk" | "ro");
    crime_occurred_at: Date;
  }[];
};
;


export type cityInp = {
  registrar?: number | userInp
  province?: number | provinceInp
  users?: number | userInp
  attackedByReports?: number | reportInp
}


export type citySchema = {
  _id?: string;
  name: string;
  english_name: string;
  createdAt?: Date;
  updatedAt?: Date;
  wars_history: string;
  conflict_timeline: string;
  casualties_info: string;
  notable_battles: string;
  occupation_info: string;
  destruction_level: string;
  civilian_impact: string;
  mass_graves_info: string;
  war_crimes_events: string;
  liberation_info: string;
  registrar?: {
    _id?: string;
    first_name: string;
    last_name: string;
    gender: ("Male" | "Female");
    address?: string;
    level: ("Ghost" | "Manager" | "Editor" | "Ordinary");
    email: string;
    is_verified: boolean;
  };
  province?: {
    _id?: string;
    name: string;
    english_name: string;
    createdAt?: Date;
    updatedAt?: Date;
    wars_history: string;
    conflict_timeline: string;
    casualties_info: string;
    notable_battles: string;
    occupation_info: string;
    destruction_level: string;
    civilian_impact: string;
    mass_graves_info: string;
    war_crimes_events: string;
    liberation_info: string;
  };
  users: {
    _id?: string;
    first_name: string;
    last_name: string;
    gender: ("Male" | "Female");
    address?: string;
    level: ("Ghost" | "Manager" | "Editor" | "Ordinary");
    email: string;
    is_verified: boolean;
  }[];
  attackedByReports: {
    _id?: string;
    title: string;
    description: string;
    location?: {
      type: "Point";
      coordinates: any[];
    };
    address?: string;
    status: ("Pending" | "Approved" | "Rejected" | "InReview");
    priority?: ("Low" | "Medium" | "High");
    selected_language: ("en" | "zh" | "hi" | "es" | "fr" | "ar" | "pt" | "ru" | "ja" | "pa" | "de" | "id" | "te" | "mr" | "tr" | "ta" | "vi" | "ko" | "it" | "fa" | "nl" | "sv" | "pl" | "uk" | "ro");
    crime_occurred_at: Date;
  }[];
};
;


export type countryInp = {
  registrar?: number | userInp
  provinces?: number | provinceInp
  hostileReports?: number | reportInp
  attackedReports?: number | reportInp
}


export type countrySchema = {
  _id?: string;
  name: string;
  english_name: string;
  createdAt?: Date;
  updatedAt?: Date;
  wars_history: string;
  conflict_timeline: string;
  casualties_info: string;
  international_response: string;
  war_crimes_documentation: string;
  human_rights_violations: string;
  genocide_info: string;
  chemical_weapons_info: string;
  displacement_info: string;
  reconstruction_status: string;
  international_sanctions: string;
  notable_war_events: string;
  registrar?: {
    _id?: string;
    first_name: string;
    last_name: string;
    gender: ("Male" | "Female");
    address?: string;
    level: ("Ghost" | "Manager" | "Editor" | "Ordinary");
    email: string;
    is_verified: boolean;
  };
  provinces: {
    _id?: string;
    name: string;
    english_name: string;
    createdAt?: Date;
    updatedAt?: Date;
    wars_history: string;
    conflict_timeline: string;
    casualties_info: string;
    notable_battles: string;
    occupation_info: string;
    destruction_level: string;
    civilian_impact: string;
    mass_graves_info: string;
    war_crimes_events: string;
    liberation_info: string;
  }[];
  hostileReports: {
    _id?: string;
    title: string;
    description: string;
    location?: {
      type: "Point";
      coordinates: any[];
    };
    address?: string;
    status: ("Pending" | "Approved" | "Rejected" | "InReview");
    priority?: ("Low" | "Medium" | "High");
    selected_language: ("en" | "zh" | "hi" | "es" | "fr" | "ar" | "pt" | "ru" | "ja" | "pa" | "de" | "id" | "te" | "mr" | "tr" | "ta" | "vi" | "ko" | "it" | "fa" | "nl" | "sv" | "pl" | "uk" | "ro");
    crime_occurred_at: Date;
  }[];
  attackedReports: {
    _id?: string;
    title: string;
    description: string;
    location?: {
      type: "Point";
      coordinates: any[];
    };
    address?: string;
    status: ("Pending" | "Approved" | "Rejected" | "InReview");
    priority?: ("Low" | "Medium" | "High");
    selected_language: ("en" | "zh" | "hi" | "es" | "fr" | "ar" | "pt" | "ru" | "ja" | "pa" | "de" | "id" | "te" | "mr" | "tr" | "ta" | "vi" | "ko" | "it" | "fa" | "nl" | "sv" | "pl" | "uk" | "ro");
    crime_occurred_at: Date;
  }[];
};
;


export type tagInp = {
  registrar?: number | userInp
  reports?: number | reportInp
  blogPosts?: number | blogPostInp
}


export type tagSchema = {
  _id?: string;
  name: string;
  description: string;
  color?: string;
  icon?: string;
  createdAt?: Date;
  updatedAt?: Date;
  registrar?: {
    _id?: string;
    first_name: string;
    last_name: string;
    gender: ("Male" | "Female");
    address?: string;
    level: ("Ghost" | "Manager" | "Editor" | "Ordinary");
    email: string;
    is_verified: boolean;
  };
  reports: {
    _id?: string;
    title: string;
    description: string;
    location?: {
      type: "Point";
      coordinates: any[];
    };
    address?: string;
    status: ("Pending" | "Approved" | "Rejected" | "InReview");
    priority?: ("Low" | "Medium" | "High");
    selected_language: ("en" | "zh" | "hi" | "es" | "fr" | "ar" | "pt" | "ru" | "ja" | "pa" | "de" | "id" | "te" | "mr" | "tr" | "ta" | "vi" | "ko" | "it" | "fa" | "nl" | "sv" | "pl" | "uk" | "ro");
    crime_occurred_at: Date;
  }[];
  blogPosts: {
    _id?: string;
    title: string;
    slug: string;
    content: string;
    isPublished: boolean;
    isFeatured: boolean;
    publishedAt?: string;
  }[];
};
;


export type categoryInp = {
  registrar?: number | userInp
  reports?: number | reportInp
}


export type categorySchema = {
  _id?: string;
  name: string;
  description: string;
  color?: string;
  icon?: string;
  createdAt?: Date;
  updatedAt?: Date;
  registrar?: {
    _id?: string;
    first_name: string;
    last_name: string;
    gender: ("Male" | "Female");
    address?: string;
    level: ("Ghost" | "Manager" | "Editor" | "Ordinary");
    email: string;
    is_verified: boolean;
  };
  reports: {
    _id?: string;
    title: string;
    description: string;
    location?: {
      type: "Point";
      coordinates: any[];
    };
    address?: string;
    status: ("Pending" | "Approved" | "Rejected" | "InReview");
    priority?: ("Low" | "Medium" | "High");
    selected_language: ("en" | "zh" | "hi" | "es" | "fr" | "ar" | "pt" | "ru" | "ja" | "pa" | "de" | "id" | "te" | "mr" | "tr" | "ta" | "vi" | "ko" | "it" | "fa" | "nl" | "sv" | "pl" | "uk" | "ro");
    crime_occurred_at: Date;
  }[];
};
;


export type documentInp = {
  documentFiles?: number | fileInp
  report?: number | reportInp
}


export type documentSchema = {
  _id?: string;
  title: string;
  description?: string;
  selected_language?: ("en" | "zh" | "hi" | "es" | "fr" | "ar" | "pt" | "ru" | "ja" | "pa" | "de" | "id" | "te" | "mr" | "tr" | "ta" | "vi" | "ko" | "it" | "fa" | "nl" | "sv" | "pl" | "uk" | "ro");
  createdAt?: Date;
  updatedAt?: Date;
  documentFiles?: {
    _id?: string;
    name: string;
    mimeType: string;
    type: ("image" | "video" | "docs");
    alt_text?: string;
  }[];
  report: {
    _id?: string;
    title: string;
    description: string;
    location?: {
      type: "Point";
      coordinates: any[];
    };
    address?: string;
    status: ("Pending" | "Approved" | "Rejected" | "InReview");
    priority?: ("Low" | "Medium" | "High");
    selected_language: ("en" | "zh" | "hi" | "es" | "fr" | "ar" | "pt" | "ru" | "ja" | "pa" | "de" | "id" | "te" | "mr" | "tr" | "ta" | "vi" | "ko" | "it" | "fa" | "nl" | "sv" | "pl" | "uk" | "ro");
    crime_occurred_at: Date;
  }[];
};
;


export type reportInp = {
  reporter?: number | userInp
  documents?: number | documentInp
  tags?: number | tagInp
  category?: number | categoryInp
  hostileCountries?: number | countryInp
  attackedCountries?: number | countryInp
  attackedProvinces?: number | provinceInp
  attackedCities?: number | cityInp

}


export type reportSchema = {
  _id?: string;
  title: string;
  description: string;
  location?: {
    type: "Point";
    coordinates: any[];
  };
  address?: string;
  status: ("Pending" | "Approved" | "Rejected" | "InReview");
  priority?: ("Low" | "Medium" | "High");
  selected_language: ("en" | "zh" | "hi" | "es" | "fr" | "ar" | "pt" | "ru" | "ja" | "pa" | "de" | "id" | "te" | "mr" | "tr" | "ta" | "vi" | "ko" | "it" | "fa" | "nl" | "sv" | "pl" | "uk" | "ro");
  crime_occurred_at: Date;
  createdAt?: Date;
  updatedAt?: Date;
  reporter: {
    _id?: string;
    first_name: string;
    last_name: string;
    gender: ("Male" | "Female");
    address?: string;
    level: ("Ghost" | "Manager" | "Editor" | "Ordinary");
    email: string;
    is_verified: boolean;
  };
  documents?: {
    _id?: string;
    title: string;
    description?: string;
    selected_language?: ("en" | "zh" | "hi" | "es" | "fr" | "ar" | "pt" | "ru" | "ja" | "pa" | "de" | "id" | "te" | "mr" | "tr" | "ta" | "vi" | "ko" | "it" | "fa" | "nl" | "sv" | "pl" | "uk" | "ro");
  }[];
  tags?: {
    _id?: string;
    name: string;
    color?: string;
    icon?: string;
  }[];
  category?: {
    _id?: string;
    name: string;
    color?: string;
    icon?: string;
  };
  hostileCountries?: {
    _id?: string;
    name: string;
    english_name: string;
    international_response: string;
    war_crimes_documentation: string;
    human_rights_violations: string;
    genocide_info: string;
    chemical_weapons_info: string;
    displacement_info: string;
    reconstruction_status: string;
    international_sanctions: string;
    notable_war_events: string;
  }[];
  attackedCountries?: {
    _id?: string;
    name: string;
    english_name: string;
    international_response: string;
    war_crimes_documentation: string;
    human_rights_violations: string;
    genocide_info: string;
    chemical_weapons_info: string;
    displacement_info: string;
    reconstruction_status: string;
    international_sanctions: string;
    notable_war_events: string;
  }[];
  attackedProvinces?: {
    _id?: string;
    name: string;
    english_name: string;
  }[];
  attackedCities?: {
    _id?: string;
    name: string;
    english_name: string;
  }[];
};
;


export type blogPostInp = {
  author?: number | userInp
  coverImage?: number | fileInp
  tags?: number | tagInp

}


export type blogPostSchema = {
  _id?: string;
  title: string;
  slug: string;
  content: string;
  isPublished: boolean;
  isFeatured: boolean;
  publishedAt?: string;
  createdAt?: Date;
  updatedAt?: Date;
  author: {
    _id?: string;
    first_name: string;
    last_name: string;
    gender: ("Male" | "Female");
    address?: string;
    level: ("Ghost" | "Manager" | "Editor" | "Ordinary");
    email: string;
    is_verified: boolean;
  };
  coverImage?: {
    _id?: string;
    name: string;
    mimeType: string;
    type: ("image" | "video" | "docs");
    alt_text?: string;
  };
  tags?: {
    _id?: string;
    name: string;
    color?: string;
    icon?: string;
  }[];
};
;


export type ReqType = {


  main: {


    country: {


      add: {
        set: {
          name: string;
          english_name: string;
          createdAt?: Date;
          updatedAt?: Date;
          wars_history: string;
          conflict_timeline: string;
          casualties_info: string;
          international_response: string;
          war_crimes_documentation: string;
          human_rights_violations: string;
          genocide_info: string;
          chemical_weapons_info: string;
          displacement_info: string;
          reconstruction_status: string;
          international_sanctions: string;
          notable_war_events: string;
        };
        get: {
          _id?: (0 | 1);
          name?: (0 | 1);
          english_name?: (0 | 1);
          createdAt?: (0 | 1);
          updatedAt?: (0 | 1);
          wars_history?: (0 | 1);
          conflict_timeline?: (0 | 1);
          casualties_info?: (0 | 1);
          international_response?: (0 | 1);
          war_crimes_documentation?: (0 | 1);
          human_rights_violations?: (0 | 1);
          genocide_info?: (0 | 1);
          chemical_weapons_info?: (0 | 1);
          displacement_info?: (0 | 1);
          reconstruction_status?: (0 | 1);
          international_sanctions?: (0 | 1);
          notable_war_events?: (0 | 1);
          registrar?: {
            _id?: (0 | 1);
            first_name?: (0 | 1);
            last_name?: (0 | 1);
            gender?: (0 | 1);
            address?: (0 | 1);
            level?: (0 | 1);
            email?: (0 | 1);
            is_verified?: (0 | 1);
          };
          provinces?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
            createdAt?: (0 | 1);
            updatedAt?: (0 | 1);
            wars_history?: (0 | 1);
            conflict_timeline?: (0 | 1);
            casualties_info?: (0 | 1);
            notable_battles?: (0 | 1);
            occupation_info?: (0 | 1);
            destruction_level?: (0 | 1);
            civilian_impact?: (0 | 1);
            mass_graves_info?: (0 | 1);
            war_crimes_events?: (0 | 1);
            liberation_info?: (0 | 1);
          };
          hostileReports?: {
            _id?: (0 | 1);
            title?: (0 | 1);
            description?: (0 | 1);
            location?: (0 | 1);
            address?: (0 | 1);
            status?: (0 | 1);
            priority?: (0 | 1);
            selected_language?: (0 | 1);
            crime_occurred_at?: (0 | 1);
          };
          attackedReports?: {
            _id?: (0 | 1);
            title?: (0 | 1);
            description?: (0 | 1);
            location?: (0 | 1);
            address?: (0 | 1);
            status?: (0 | 1);
            priority?: (0 | 1);
            selected_language?: (0 | 1);
            crime_occurred_at?: (0 | 1);
          };
        };
      };


      update: {
        set: {
          _id: string;
          name?: string;
          english_name?: string;
          wars_history?: string;
          conflict_timeline?: string;
          casualties_info?: string;
          international_response?: string;
          war_crimes_documentation?: string;
          human_rights_violations?: string;
          genocide_info?: string;
          chemical_weapons_info?: string;
          displacement_info?: string;
          reconstruction_status?: string;
          international_sanctions?: string;
          notable_war_events?: string;
        };
        get: {
          _id?: (0 | 1);
          name?: (0 | 1);
          english_name?: (0 | 1);
          createdAt?: (0 | 1);
          updatedAt?: (0 | 1);
          wars_history?: (0 | 1);
          conflict_timeline?: (0 | 1);
          casualties_info?: (0 | 1);
          international_response?: (0 | 1);
          war_crimes_documentation?: (0 | 1);
          human_rights_violations?: (0 | 1);
          genocide_info?: (0 | 1);
          chemical_weapons_info?: (0 | 1);
          displacement_info?: (0 | 1);
          reconstruction_status?: (0 | 1);
          international_sanctions?: (0 | 1);
          notable_war_events?: (0 | 1);
          registrar?: {
            _id?: (0 | 1);
            first_name?: (0 | 1);
            last_name?: (0 | 1);
            gender?: (0 | 1);
            address?: (0 | 1);
            level?: (0 | 1);
            email?: (0 | 1);
            is_verified?: (0 | 1);
          };
          provinces?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
            createdAt?: (0 | 1);
            updatedAt?: (0 | 1);
            wars_history?: (0 | 1);
            conflict_timeline?: (0 | 1);
            casualties_info?: (0 | 1);
            notable_battles?: (0 | 1);
            occupation_info?: (0 | 1);
            destruction_level?: (0 | 1);
            civilian_impact?: (0 | 1);
            mass_graves_info?: (0 | 1);
            war_crimes_events?: (0 | 1);
            liberation_info?: (0 | 1);
          };
          hostileReports?: {
            _id?: (0 | 1);
            title?: (0 | 1);
            description?: (0 | 1);
            location?: (0 | 1);
            address?: (0 | 1);
            status?: (0 | 1);
            priority?: (0 | 1);
            selected_language?: (0 | 1);
            crime_occurred_at?: (0 | 1);
          };
          attackedReports?: {
            _id?: (0 | 1);
            title?: (0 | 1);
            description?: (0 | 1);
            location?: (0 | 1);
            address?: (0 | 1);
            status?: (0 | 1);
            priority?: (0 | 1);
            selected_language?: (0 | 1);
            crime_occurred_at?: (0 | 1);
          };
        };
      };


      get: {
        set: {
          _id: string;
        };
        get: {
          _id?: (0 | 1);
          name?: (0 | 1);
          english_name?: (0 | 1);
          createdAt?: (0 | 1);
          updatedAt?: (0 | 1);
          wars_history?: (0 | 1);
          conflict_timeline?: (0 | 1);
          casualties_info?: (0 | 1);
          international_response?: (0 | 1);
          war_crimes_documentation?: (0 | 1);
          human_rights_violations?: (0 | 1);
          genocide_info?: (0 | 1);
          chemical_weapons_info?: (0 | 1);
          displacement_info?: (0 | 1);
          reconstruction_status?: (0 | 1);
          international_sanctions?: (0 | 1);
          notable_war_events?: (0 | 1);
          registrar?: {
            _id?: (0 | 1);
            first_name?: (0 | 1);
            last_name?: (0 | 1);
            gender?: (0 | 1);
            address?: (0 | 1);
            level?: (0 | 1);
            email?: (0 | 1);
            is_verified?: (0 | 1);
            avatar?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            national_card?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            province?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            city?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            uploadedAssets?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            reports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
            blogPosts?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              slug?: (0 | 1);
              content?: (0 | 1);
              isPublished?: (0 | 1);
              isFeatured?: (0 | 1);
              publishedAt?: (0 | 1);
            };
          };
          provinces?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
            createdAt?: (0 | 1);
            updatedAt?: (0 | 1);
            wars_history?: (0 | 1);
            conflict_timeline?: (0 | 1);
            casualties_info?: (0 | 1);
            notable_battles?: (0 | 1);
            occupation_info?: (0 | 1);
            destruction_level?: (0 | 1);
            civilian_impact?: (0 | 1);
            mass_graves_info?: (0 | 1);
            war_crimes_events?: (0 | 1);
            liberation_info?: (0 | 1);
            registrar?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            country?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              createdAt?: (0 | 1);
              updatedAt?: (0 | 1);
              wars_history?: (0 | 1);
              conflict_timeline?: (0 | 1);
              casualties_info?: (0 | 1);
              international_response?: (0 | 1);
              war_crimes_documentation?: (0 | 1);
              human_rights_violations?: (0 | 1);
              genocide_info?: (0 | 1);
              chemical_weapons_info?: (0 | 1);
              displacement_info?: (0 | 1);
              reconstruction_status?: (0 | 1);
              international_sanctions?: (0 | 1);
              notable_war_events?: (0 | 1);
            };
            users?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            cities?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              createdAt?: (0 | 1);
              updatedAt?: (0 | 1);
              wars_history?: (0 | 1);
              conflict_timeline?: (0 | 1);
              casualties_info?: (0 | 1);
              notable_battles?: (0 | 1);
              occupation_info?: (0 | 1);
              destruction_level?: (0 | 1);
              civilian_impact?: (0 | 1);
              mass_graves_info?: (0 | 1);
              war_crimes_events?: (0 | 1);
              liberation_info?: (0 | 1);
            };
            capital?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              createdAt?: (0 | 1);
              updatedAt?: (0 | 1);
              wars_history?: (0 | 1);
              conflict_timeline?: (0 | 1);
              casualties_info?: (0 | 1);
              notable_battles?: (0 | 1);
              occupation_info?: (0 | 1);
              destruction_level?: (0 | 1);
              civilian_impact?: (0 | 1);
              mass_graves_info?: (0 | 1);
              war_crimes_events?: (0 | 1);
              liberation_info?: (0 | 1);
            };
            attackedByReports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
          };
          hostileReports?: {
            _id?: (0 | 1);
            title?: (0 | 1);
            description?: (0 | 1);
            location?: (0 | 1);
            address?: (0 | 1);
            status?: (0 | 1);
            priority?: (0 | 1);
            selected_language?: (0 | 1);
            crime_occurred_at?: (0 | 1);
            reporter?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            documents?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              selected_language?: (0 | 1);
            };
            tags?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              color?: (0 | 1);
              icon?: (0 | 1);
            };
            category?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              color?: (0 | 1);
              icon?: (0 | 1);
            };
            hostileCountries?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              international_response?: (0 | 1);
              war_crimes_documentation?: (0 | 1);
              human_rights_violations?: (0 | 1);
              genocide_info?: (0 | 1);
              chemical_weapons_info?: (0 | 1);
              displacement_info?: (0 | 1);
              reconstruction_status?: (0 | 1);
              international_sanctions?: (0 | 1);
              notable_war_events?: (0 | 1);
            };
            attackedCountries?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              international_response?: (0 | 1);
              war_crimes_documentation?: (0 | 1);
              human_rights_violations?: (0 | 1);
              genocide_info?: (0 | 1);
              chemical_weapons_info?: (0 | 1);
              displacement_info?: (0 | 1);
              reconstruction_status?: (0 | 1);
              international_sanctions?: (0 | 1);
              notable_war_events?: (0 | 1);
            };
            attackedProvinces?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            attackedCities?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
          };
          attackedReports?: {
            _id?: (0 | 1);
            title?: (0 | 1);
            description?: (0 | 1);
            location?: (0 | 1);
            address?: (0 | 1);
            status?: (0 | 1);
            priority?: (0 | 1);
            selected_language?: (0 | 1);
            crime_occurred_at?: (0 | 1);
            reporter?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            documents?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              selected_language?: (0 | 1);
            };
            tags?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              color?: (0 | 1);
              icon?: (0 | 1);
            };
            category?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              color?: (0 | 1);
              icon?: (0 | 1);
            };
            hostileCountries?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              international_response?: (0 | 1);
              war_crimes_documentation?: (0 | 1);
              human_rights_violations?: (0 | 1);
              genocide_info?: (0 | 1);
              chemical_weapons_info?: (0 | 1);
              displacement_info?: (0 | 1);
              reconstruction_status?: (0 | 1);
              international_sanctions?: (0 | 1);
              notable_war_events?: (0 | 1);
            };
            attackedCountries?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              international_response?: (0 | 1);
              war_crimes_documentation?: (0 | 1);
              human_rights_violations?: (0 | 1);
              genocide_info?: (0 | 1);
              chemical_weapons_info?: (0 | 1);
              displacement_info?: (0 | 1);
              reconstruction_status?: (0 | 1);
              international_sanctions?: (0 | 1);
              notable_war_events?: (0 | 1);
            };
            attackedProvinces?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            attackedCities?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
          };
        };
      };


      gets: {
        set: {
          page: number;
          limit: number;
          name?: string;
          search?: string;
        };
        get: {
          _id?: (0 | 1);
          name?: (0 | 1);
          english_name?: (0 | 1);
          createdAt?: (0 | 1);
          updatedAt?: (0 | 1);
          wars_history?: (0 | 1);
          conflict_timeline?: (0 | 1);
          casualties_info?: (0 | 1);
          international_response?: (0 | 1);
          war_crimes_documentation?: (0 | 1);
          human_rights_violations?: (0 | 1);
          genocide_info?: (0 | 1);
          chemical_weapons_info?: (0 | 1);
          displacement_info?: (0 | 1);
          reconstruction_status?: (0 | 1);
          international_sanctions?: (0 | 1);
          notable_war_events?: (0 | 1);
          registrar?: {
            _id?: (0 | 1);
            first_name?: (0 | 1);
            last_name?: (0 | 1);
            gender?: (0 | 1);
            address?: (0 | 1);
            level?: (0 | 1);
            email?: (0 | 1);
            is_verified?: (0 | 1);
            avatar?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            national_card?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            province?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            city?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            uploadedAssets?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            reports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
            blogPosts?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              slug?: (0 | 1);
              content?: (0 | 1);
              isPublished?: (0 | 1);
              isFeatured?: (0 | 1);
              publishedAt?: (0 | 1);
            };
          };
          provinces?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
            createdAt?: (0 | 1);
            updatedAt?: (0 | 1);
            wars_history?: (0 | 1);
            conflict_timeline?: (0 | 1);
            casualties_info?: (0 | 1);
            notable_battles?: (0 | 1);
            occupation_info?: (0 | 1);
            destruction_level?: (0 | 1);
            civilian_impact?: (0 | 1);
            mass_graves_info?: (0 | 1);
            war_crimes_events?: (0 | 1);
            liberation_info?: (0 | 1);
            registrar?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            country?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              createdAt?: (0 | 1);
              updatedAt?: (0 | 1);
              wars_history?: (0 | 1);
              conflict_timeline?: (0 | 1);
              casualties_info?: (0 | 1);
              international_response?: (0 | 1);
              war_crimes_documentation?: (0 | 1);
              human_rights_violations?: (0 | 1);
              genocide_info?: (0 | 1);
              chemical_weapons_info?: (0 | 1);
              displacement_info?: (0 | 1);
              reconstruction_status?: (0 | 1);
              international_sanctions?: (0 | 1);
              notable_war_events?: (0 | 1);
            };
            users?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            cities?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              createdAt?: (0 | 1);
              updatedAt?: (0 | 1);
              wars_history?: (0 | 1);
              conflict_timeline?: (0 | 1);
              casualties_info?: (0 | 1);
              notable_battles?: (0 | 1);
              occupation_info?: (0 | 1);
              destruction_level?: (0 | 1);
              civilian_impact?: (0 | 1);
              mass_graves_info?: (0 | 1);
              war_crimes_events?: (0 | 1);
              liberation_info?: (0 | 1);
            };
            capital?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              createdAt?: (0 | 1);
              updatedAt?: (0 | 1);
              wars_history?: (0 | 1);
              conflict_timeline?: (0 | 1);
              casualties_info?: (0 | 1);
              notable_battles?: (0 | 1);
              occupation_info?: (0 | 1);
              destruction_level?: (0 | 1);
              civilian_impact?: (0 | 1);
              mass_graves_info?: (0 | 1);
              war_crimes_events?: (0 | 1);
              liberation_info?: (0 | 1);
            };
            attackedByReports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
          };
          hostileReports?: {
            _id?: (0 | 1);
            title?: (0 | 1);
            description?: (0 | 1);
            location?: (0 | 1);
            address?: (0 | 1);
            status?: (0 | 1);
            priority?: (0 | 1);
            selected_language?: (0 | 1);
            crime_occurred_at?: (0 | 1);
            reporter?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            documents?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              selected_language?: (0 | 1);
            };
            tags?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              color?: (0 | 1);
              icon?: (0 | 1);
            };
            category?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              color?: (0 | 1);
              icon?: (0 | 1);
            };
            hostileCountries?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              international_response?: (0 | 1);
              war_crimes_documentation?: (0 | 1);
              human_rights_violations?: (0 | 1);
              genocide_info?: (0 | 1);
              chemical_weapons_info?: (0 | 1);
              displacement_info?: (0 | 1);
              reconstruction_status?: (0 | 1);
              international_sanctions?: (0 | 1);
              notable_war_events?: (0 | 1);
            };
            attackedCountries?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              international_response?: (0 | 1);
              war_crimes_documentation?: (0 | 1);
              human_rights_violations?: (0 | 1);
              genocide_info?: (0 | 1);
              chemical_weapons_info?: (0 | 1);
              displacement_info?: (0 | 1);
              reconstruction_status?: (0 | 1);
              international_sanctions?: (0 | 1);
              notable_war_events?: (0 | 1);
            };
            attackedProvinces?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            attackedCities?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
          };
          attackedReports?: {
            _id?: (0 | 1);
            title?: (0 | 1);
            description?: (0 | 1);
            location?: (0 | 1);
            address?: (0 | 1);
            status?: (0 | 1);
            priority?: (0 | 1);
            selected_language?: (0 | 1);
            crime_occurred_at?: (0 | 1);
            reporter?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            documents?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              selected_language?: (0 | 1);
            };
            tags?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              color?: (0 | 1);
              icon?: (0 | 1);
            };
            category?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              color?: (0 | 1);
              icon?: (0 | 1);
            };
            hostileCountries?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              international_response?: (0 | 1);
              war_crimes_documentation?: (0 | 1);
              human_rights_violations?: (0 | 1);
              genocide_info?: (0 | 1);
              chemical_weapons_info?: (0 | 1);
              displacement_info?: (0 | 1);
              reconstruction_status?: (0 | 1);
              international_sanctions?: (0 | 1);
              notable_war_events?: (0 | 1);
            };
            attackedCountries?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              international_response?: (0 | 1);
              war_crimes_documentation?: (0 | 1);
              human_rights_violations?: (0 | 1);
              genocide_info?: (0 | 1);
              chemical_weapons_info?: (0 | 1);
              displacement_info?: (0 | 1);
              reconstruction_status?: (0 | 1);
              international_sanctions?: (0 | 1);
              notable_war_events?: (0 | 1);
            };
            attackedProvinces?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            attackedCities?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
          };
        };
      };


      remove: {
        set: {
          _id: string;
          hardCascade?: boolean;
        };
        get: {
          success?: (0 | 1);
        };
      };


      count: {
        set: {
          name?: string;
        };
        get: {
          qty?: (0 | 1);
        };
      };


    }


    city: {


      add: {
        set: {
          name: string;
          english_name: string;
          createdAt?: Date;
          updatedAt?: Date;
          wars_history: string;
          conflict_timeline: string;
          casualties_info: string;
          notable_battles: string;
          occupation_info: string;
          destruction_level: string;
          civilian_impact: string;
          mass_graves_info: string;
          war_crimes_events: string;
          liberation_info: string;
          provinceId: string;
          isCapital: boolean;
        };
        get: {
          _id?: (0 | 1);
          name?: (0 | 1);
          english_name?: (0 | 1);
          createdAt?: (0 | 1);
          updatedAt?: (0 | 1);
          wars_history?: (0 | 1);
          conflict_timeline?: (0 | 1);
          casualties_info?: (0 | 1);
          notable_battles?: (0 | 1);
          occupation_info?: (0 | 1);
          destruction_level?: (0 | 1);
          civilian_impact?: (0 | 1);
          mass_graves_info?: (0 | 1);
          war_crimes_events?: (0 | 1);
          liberation_info?: (0 | 1);
          registrar?: {
            _id?: (0 | 1);
            first_name?: (0 | 1);
            last_name?: (0 | 1);
            gender?: (0 | 1);
            address?: (0 | 1);
            level?: (0 | 1);
            email?: (0 | 1);
            is_verified?: (0 | 1);
          };
          province?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
            createdAt?: (0 | 1);
            updatedAt?: (0 | 1);
            wars_history?: (0 | 1);
            conflict_timeline?: (0 | 1);
            casualties_info?: (0 | 1);
            notable_battles?: (0 | 1);
            occupation_info?: (0 | 1);
            destruction_level?: (0 | 1);
            civilian_impact?: (0 | 1);
            mass_graves_info?: (0 | 1);
            war_crimes_events?: (0 | 1);
            liberation_info?: (0 | 1);
          };
          users?: {
            _id?: (0 | 1);
            first_name?: (0 | 1);
            last_name?: (0 | 1);
            gender?: (0 | 1);
            address?: (0 | 1);
            level?: (0 | 1);
            email?: (0 | 1);
            is_verified?: (0 | 1);
          };
          attackedByReports?: {
            _id?: (0 | 1);
            title?: (0 | 1);
            description?: (0 | 1);
            location?: (0 | 1);
            address?: (0 | 1);
            status?: (0 | 1);
            priority?: (0 | 1);
            selected_language?: (0 | 1);
            crime_occurred_at?: (0 | 1);
          };
        };
      };


      update: {
        set: {
          _id: string;
          name?: string;
          english_name?: string;
          area?: {
            type: "Polygon";
            coordinates: any[];
          };
          center?: {
            type: "Point";
            coordinates: any[];
          };
          wars_history?: string;
          conflict_timeline?: string;
          casualties_info?: string;
          notable_battles?: string;
          occupation_info?: string;
          destruction_level?: string;
          civilian_impact?: string;
          mass_graves_info?: string;
          war_crimes_events?: string;
          liberation_info?: string;
        };
        get: {
          _id?: (0 | 1);
          name?: (0 | 1);
          english_name?: (0 | 1);
          createdAt?: (0 | 1);
          updatedAt?: (0 | 1);
          wars_history?: (0 | 1);
          conflict_timeline?: (0 | 1);
          casualties_info?: (0 | 1);
          notable_battles?: (0 | 1);
          occupation_info?: (0 | 1);
          destruction_level?: (0 | 1);
          civilian_impact?: (0 | 1);
          mass_graves_info?: (0 | 1);
          war_crimes_events?: (0 | 1);
          liberation_info?: (0 | 1);
          registrar?: {
            _id?: (0 | 1);
            first_name?: (0 | 1);
            last_name?: (0 | 1);
            gender?: (0 | 1);
            address?: (0 | 1);
            level?: (0 | 1);
            email?: (0 | 1);
            is_verified?: (0 | 1);
          };
          province?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
            createdAt?: (0 | 1);
            updatedAt?: (0 | 1);
            wars_history?: (0 | 1);
            conflict_timeline?: (0 | 1);
            casualties_info?: (0 | 1);
            notable_battles?: (0 | 1);
            occupation_info?: (0 | 1);
            destruction_level?: (0 | 1);
            civilian_impact?: (0 | 1);
            mass_graves_info?: (0 | 1);
            war_crimes_events?: (0 | 1);
            liberation_info?: (0 | 1);
          };
          users?: {
            _id?: (0 | 1);
            first_name?: (0 | 1);
            last_name?: (0 | 1);
            gender?: (0 | 1);
            address?: (0 | 1);
            level?: (0 | 1);
            email?: (0 | 1);
            is_verified?: (0 | 1);
          };
          attackedByReports?: {
            _id?: (0 | 1);
            title?: (0 | 1);
            description?: (0 | 1);
            location?: (0 | 1);
            address?: (0 | 1);
            status?: (0 | 1);
            priority?: (0 | 1);
            selected_language?: (0 | 1);
            crime_occurred_at?: (0 | 1);
          };
        };
      };


      get: {
        set: {
          _id: string;
        };
        get: {
          _id?: (0 | 1);
          name?: (0 | 1);
          english_name?: (0 | 1);
          createdAt?: (0 | 1);
          updatedAt?: (0 | 1);
          wars_history?: (0 | 1);
          conflict_timeline?: (0 | 1);
          casualties_info?: (0 | 1);
          notable_battles?: (0 | 1);
          occupation_info?: (0 | 1);
          destruction_level?: (0 | 1);
          civilian_impact?: (0 | 1);
          mass_graves_info?: (0 | 1);
          war_crimes_events?: (0 | 1);
          liberation_info?: (0 | 1);
          registrar?: {
            _id?: (0 | 1);
            first_name?: (0 | 1);
            last_name?: (0 | 1);
            gender?: (0 | 1);
            address?: (0 | 1);
            level?: (0 | 1);
            email?: (0 | 1);
            is_verified?: (0 | 1);
            avatar?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            national_card?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            province?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            city?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            uploadedAssets?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            reports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
            blogPosts?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              slug?: (0 | 1);
              content?: (0 | 1);
              isPublished?: (0 | 1);
              isFeatured?: (0 | 1);
              publishedAt?: (0 | 1);
            };
          };
          province?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
            createdAt?: (0 | 1);
            updatedAt?: (0 | 1);
            wars_history?: (0 | 1);
            conflict_timeline?: (0 | 1);
            casualties_info?: (0 | 1);
            notable_battles?: (0 | 1);
            occupation_info?: (0 | 1);
            destruction_level?: (0 | 1);
            civilian_impact?: (0 | 1);
            mass_graves_info?: (0 | 1);
            war_crimes_events?: (0 | 1);
            liberation_info?: (0 | 1);
            registrar?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            country?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              createdAt?: (0 | 1);
              updatedAt?: (0 | 1);
              wars_history?: (0 | 1);
              conflict_timeline?: (0 | 1);
              casualties_info?: (0 | 1);
              international_response?: (0 | 1);
              war_crimes_documentation?: (0 | 1);
              human_rights_violations?: (0 | 1);
              genocide_info?: (0 | 1);
              chemical_weapons_info?: (0 | 1);
              displacement_info?: (0 | 1);
              reconstruction_status?: (0 | 1);
              international_sanctions?: (0 | 1);
              notable_war_events?: (0 | 1);
            };
            users?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            cities?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              createdAt?: (0 | 1);
              updatedAt?: (0 | 1);
              wars_history?: (0 | 1);
              conflict_timeline?: (0 | 1);
              casualties_info?: (0 | 1);
              notable_battles?: (0 | 1);
              occupation_info?: (0 | 1);
              destruction_level?: (0 | 1);
              civilian_impact?: (0 | 1);
              mass_graves_info?: (0 | 1);
              war_crimes_events?: (0 | 1);
              liberation_info?: (0 | 1);
            };
            capital?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              createdAt?: (0 | 1);
              updatedAt?: (0 | 1);
              wars_history?: (0 | 1);
              conflict_timeline?: (0 | 1);
              casualties_info?: (0 | 1);
              notable_battles?: (0 | 1);
              occupation_info?: (0 | 1);
              destruction_level?: (0 | 1);
              civilian_impact?: (0 | 1);
              mass_graves_info?: (0 | 1);
              war_crimes_events?: (0 | 1);
              liberation_info?: (0 | 1);
            };
            attackedByReports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
          };
          users?: {
            _id?: (0 | 1);
            first_name?: (0 | 1);
            last_name?: (0 | 1);
            gender?: (0 | 1);
            address?: (0 | 1);
            level?: (0 | 1);
            email?: (0 | 1);
            is_verified?: (0 | 1);
            avatar?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            national_card?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            province?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            city?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            uploadedAssets?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            reports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
            blogPosts?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              slug?: (0 | 1);
              content?: (0 | 1);
              isPublished?: (0 | 1);
              isFeatured?: (0 | 1);
              publishedAt?: (0 | 1);
            };
          };
          attackedByReports?: {
            _id?: (0 | 1);
            title?: (0 | 1);
            description?: (0 | 1);
            location?: (0 | 1);
            address?: (0 | 1);
            status?: (0 | 1);
            priority?: (0 | 1);
            selected_language?: (0 | 1);
            crime_occurred_at?: (0 | 1);
            reporter?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            documents?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              selected_language?: (0 | 1);
            };
            tags?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              color?: (0 | 1);
              icon?: (0 | 1);
            };
            category?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              color?: (0 | 1);
              icon?: (0 | 1);
            };
            hostileCountries?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              international_response?: (0 | 1);
              war_crimes_documentation?: (0 | 1);
              human_rights_violations?: (0 | 1);
              genocide_info?: (0 | 1);
              chemical_weapons_info?: (0 | 1);
              displacement_info?: (0 | 1);
              reconstruction_status?: (0 | 1);
              international_sanctions?: (0 | 1);
              notable_war_events?: (0 | 1);
            };
            attackedCountries?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              international_response?: (0 | 1);
              war_crimes_documentation?: (0 | 1);
              human_rights_violations?: (0 | 1);
              genocide_info?: (0 | 1);
              chemical_weapons_info?: (0 | 1);
              displacement_info?: (0 | 1);
              reconstruction_status?: (0 | 1);
              international_sanctions?: (0 | 1);
              notable_war_events?: (0 | 1);
            };
            attackedProvinces?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            attackedCities?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
          };
        };
      };


      gets: {
        set: {
          page: number;
          limit: number;
          name?: string;
          provinceId?: string;
        };
        get: {
          _id?: (0 | 1);
          name?: (0 | 1);
          english_name?: (0 | 1);
          createdAt?: (0 | 1);
          updatedAt?: (0 | 1);
          wars_history?: (0 | 1);
          conflict_timeline?: (0 | 1);
          casualties_info?: (0 | 1);
          notable_battles?: (0 | 1);
          occupation_info?: (0 | 1);
          destruction_level?: (0 | 1);
          civilian_impact?: (0 | 1);
          mass_graves_info?: (0 | 1);
          war_crimes_events?: (0 | 1);
          liberation_info?: (0 | 1);
          registrar?: {
            _id?: (0 | 1);
            first_name?: (0 | 1);
            last_name?: (0 | 1);
            gender?: (0 | 1);
            address?: (0 | 1);
            level?: (0 | 1);
            email?: (0 | 1);
            is_verified?: (0 | 1);
            avatar?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            national_card?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            province?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            city?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            uploadedAssets?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            reports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
            blogPosts?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              slug?: (0 | 1);
              content?: (0 | 1);
              isPublished?: (0 | 1);
              isFeatured?: (0 | 1);
              publishedAt?: (0 | 1);
            };
          };
          province?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
            createdAt?: (0 | 1);
            updatedAt?: (0 | 1);
            wars_history?: (0 | 1);
            conflict_timeline?: (0 | 1);
            casualties_info?: (0 | 1);
            notable_battles?: (0 | 1);
            occupation_info?: (0 | 1);
            destruction_level?: (0 | 1);
            civilian_impact?: (0 | 1);
            mass_graves_info?: (0 | 1);
            war_crimes_events?: (0 | 1);
            liberation_info?: (0 | 1);
            registrar?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            country?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              createdAt?: (0 | 1);
              updatedAt?: (0 | 1);
              wars_history?: (0 | 1);
              conflict_timeline?: (0 | 1);
              casualties_info?: (0 | 1);
              international_response?: (0 | 1);
              war_crimes_documentation?: (0 | 1);
              human_rights_violations?: (0 | 1);
              genocide_info?: (0 | 1);
              chemical_weapons_info?: (0 | 1);
              displacement_info?: (0 | 1);
              reconstruction_status?: (0 | 1);
              international_sanctions?: (0 | 1);
              notable_war_events?: (0 | 1);
            };
            users?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            cities?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              createdAt?: (0 | 1);
              updatedAt?: (0 | 1);
              wars_history?: (0 | 1);
              conflict_timeline?: (0 | 1);
              casualties_info?: (0 | 1);
              notable_battles?: (0 | 1);
              occupation_info?: (0 | 1);
              destruction_level?: (0 | 1);
              civilian_impact?: (0 | 1);
              mass_graves_info?: (0 | 1);
              war_crimes_events?: (0 | 1);
              liberation_info?: (0 | 1);
            };
            capital?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              createdAt?: (0 | 1);
              updatedAt?: (0 | 1);
              wars_history?: (0 | 1);
              conflict_timeline?: (0 | 1);
              casualties_info?: (0 | 1);
              notable_battles?: (0 | 1);
              occupation_info?: (0 | 1);
              destruction_level?: (0 | 1);
              civilian_impact?: (0 | 1);
              mass_graves_info?: (0 | 1);
              war_crimes_events?: (0 | 1);
              liberation_info?: (0 | 1);
            };
            attackedByReports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
          };
          users?: {
            _id?: (0 | 1);
            first_name?: (0 | 1);
            last_name?: (0 | 1);
            gender?: (0 | 1);
            address?: (0 | 1);
            level?: (0 | 1);
            email?: (0 | 1);
            is_verified?: (0 | 1);
            avatar?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            national_card?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            province?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            city?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            uploadedAssets?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            reports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
            blogPosts?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              slug?: (0 | 1);
              content?: (0 | 1);
              isPublished?: (0 | 1);
              isFeatured?: (0 | 1);
              publishedAt?: (0 | 1);
            };
          };
          attackedByReports?: {
            _id?: (0 | 1);
            title?: (0 | 1);
            description?: (0 | 1);
            location?: (0 | 1);
            address?: (0 | 1);
            status?: (0 | 1);
            priority?: (0 | 1);
            selected_language?: (0 | 1);
            crime_occurred_at?: (0 | 1);
            reporter?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            documents?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              selected_language?: (0 | 1);
            };
            tags?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              color?: (0 | 1);
              icon?: (0 | 1);
            };
            category?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              color?: (0 | 1);
              icon?: (0 | 1);
            };
            hostileCountries?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              international_response?: (0 | 1);
              war_crimes_documentation?: (0 | 1);
              human_rights_violations?: (0 | 1);
              genocide_info?: (0 | 1);
              chemical_weapons_info?: (0 | 1);
              displacement_info?: (0 | 1);
              reconstruction_status?: (0 | 1);
              international_sanctions?: (0 | 1);
              notable_war_events?: (0 | 1);
            };
            attackedCountries?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              international_response?: (0 | 1);
              war_crimes_documentation?: (0 | 1);
              human_rights_violations?: (0 | 1);
              genocide_info?: (0 | 1);
              chemical_weapons_info?: (0 | 1);
              displacement_info?: (0 | 1);
              reconstruction_status?: (0 | 1);
              international_sanctions?: (0 | 1);
              notable_war_events?: (0 | 1);
            };
            attackedProvinces?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            attackedCities?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
          };
        };
      };


      remove: {
        set: {
          _id: string;
          hardCascade?: boolean;
        };
        get: {
          success?: (0 | 1);
        };
      };


      count: {
        set: {
          name?: string;
        };
        get: {
          qty?: (0 | 1);
        };
      };


    }


    file: {


      get: {
        set: {
          _id: string;
        };
        get: {
          _id?: (0 | 1);
          name?: (0 | 1);
          mimeType?: (0 | 1);
          size?: (0 | 1);
          type?: (0 | 1);
          alt_text?: (0 | 1);
          createdAt?: (0 | 1);
          updatedAt?: (0 | 1);
          uploader?: {
            _id?: (0 | 1);
            first_name?: (0 | 1);
            last_name?: (0 | 1);
            gender?: (0 | 1);
            address?: (0 | 1);
            level?: (0 | 1);
            email?: (0 | 1);
            is_verified?: (0 | 1);
            avatar?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            national_card?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            province?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            city?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            uploadedAssets?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            reports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
            blogPosts?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              slug?: (0 | 1);
              content?: (0 | 1);
              isPublished?: (0 | 1);
              isFeatured?: (0 | 1);
              publishedAt?: (0 | 1);
            };
          };
        };
      };


      gets: {
        set: {
          page?: number;
          limit?: number;
          skip?: number;
          search?: string;
          sortBy?: ("createdAt" | "updatedAt" | "name");
          sortOrder?: ("asc" | "desc");
        };
        get: {
          _id?: (0 | 1);
          name?: (0 | 1);
          mimeType?: (0 | 1);
          size?: (0 | 1);
          type?: (0 | 1);
          alt_text?: (0 | 1);
          createdAt?: (0 | 1);
          updatedAt?: (0 | 1);
          uploader?: {
            _id?: (0 | 1);
            first_name?: (0 | 1);
            last_name?: (0 | 1);
            gender?: (0 | 1);
            address?: (0 | 1);
            level?: (0 | 1);
            email?: (0 | 1);
            is_verified?: (0 | 1);
            avatar?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            national_card?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            province?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            city?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            uploadedAssets?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            reports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
            blogPosts?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              slug?: (0 | 1);
              content?: (0 | 1);
              isPublished?: (0 | 1);
              isFeatured?: (0 | 1);
              publishedAt?: (0 | 1);
            };
          };
        };
      };


      update: {
        set: {
          _id: string;
          alt_text?: string;
        };
        get: {
          _id?: (0 | 1);
          name?: (0 | 1);
          mimeType?: (0 | 1);
          size?: (0 | 1);
          type?: (0 | 1);
          alt_text?: (0 | 1);
          createdAt?: (0 | 1);
          updatedAt?: (0 | 1);
          uploader?: {
            _id?: (0 | 1);
            first_name?: (0 | 1);
            last_name?: (0 | 1);
            gender?: (0 | 1);
            address?: (0 | 1);
            level?: (0 | 1);
            email?: (0 | 1);
            is_verified?: (0 | 1);
            avatar?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            national_card?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            province?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            city?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            uploadedAssets?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            reports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
            blogPosts?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              slug?: (0 | 1);
              content?: (0 | 1);
              isPublished?: (0 | 1);
              isFeatured?: (0 | 1);
              publishedAt?: (0 | 1);
            };
          };
        };
      };


      uploadFile: {
        set: {
          type: ("video" | "image" | "doc");
          createdAt?: Date;
          updatedAt?: Date;
        };
        get: {
          _id?: (0 | 1);
          name?: (0 | 1);
          mimeType?: (0 | 1);
          size?: (0 | 1);
          type?: (0 | 1);
          alt_text?: (0 | 1);
          createdAt?: (0 | 1);
          updatedAt?: (0 | 1);
          uploader?: {
            _id?: (0 | 1);
            first_name?: (0 | 1);
            last_name?: (0 | 1);
            gender?: (0 | 1);
            address?: (0 | 1);
            level?: (0 | 1);
            email?: (0 | 1);
            is_verified?: (0 | 1);
          };
        };
      };


    }


    province: {


      add: {
        set: {
          name: string;
          english_name: string;
          createdAt?: Date;
          updatedAt?: Date;
          wars_history: string;
          conflict_timeline: string;
          casualties_info: string;
          notable_battles: string;
          occupation_info: string;
          destruction_level: string;
          civilian_impact: string;
          mass_graves_info: string;
          war_crimes_events: string;
          liberation_info: string;
          countryId?: string;
        };
        get: {
          _id?: (0 | 1);
          name?: (0 | 1);
          english_name?: (0 | 1);
          createdAt?: (0 | 1);
          updatedAt?: (0 | 1);
          wars_history?: (0 | 1);
          conflict_timeline?: (0 | 1);
          casualties_info?: (0 | 1);
          notable_battles?: (0 | 1);
          occupation_info?: (0 | 1);
          destruction_level?: (0 | 1);
          civilian_impact?: (0 | 1);
          mass_graves_info?: (0 | 1);
          war_crimes_events?: (0 | 1);
          liberation_info?: (0 | 1);
          registrar?: {
            _id?: (0 | 1);
            first_name?: (0 | 1);
            last_name?: (0 | 1);
            gender?: (0 | 1);
            address?: (0 | 1);
            level?: (0 | 1);
            email?: (0 | 1);
            is_verified?: (0 | 1);
          };
          country?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
            createdAt?: (0 | 1);
            updatedAt?: (0 | 1);
            wars_history?: (0 | 1);
            conflict_timeline?: (0 | 1);
            casualties_info?: (0 | 1);
            international_response?: (0 | 1);
            war_crimes_documentation?: (0 | 1);
            human_rights_violations?: (0 | 1);
            genocide_info?: (0 | 1);
            chemical_weapons_info?: (0 | 1);
            displacement_info?: (0 | 1);
            reconstruction_status?: (0 | 1);
            international_sanctions?: (0 | 1);
            notable_war_events?: (0 | 1);
          };
          users?: {
            _id?: (0 | 1);
            first_name?: (0 | 1);
            last_name?: (0 | 1);
            gender?: (0 | 1);
            address?: (0 | 1);
            level?: (0 | 1);
            email?: (0 | 1);
            is_verified?: (0 | 1);
          };
          cities?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
            createdAt?: (0 | 1);
            updatedAt?: (0 | 1);
            wars_history?: (0 | 1);
            conflict_timeline?: (0 | 1);
            casualties_info?: (0 | 1);
            notable_battles?: (0 | 1);
            occupation_info?: (0 | 1);
            destruction_level?: (0 | 1);
            civilian_impact?: (0 | 1);
            mass_graves_info?: (0 | 1);
            war_crimes_events?: (0 | 1);
            liberation_info?: (0 | 1);
          };
          capital?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
            createdAt?: (0 | 1);
            updatedAt?: (0 | 1);
            wars_history?: (0 | 1);
            conflict_timeline?: (0 | 1);
            casualties_info?: (0 | 1);
            notable_battles?: (0 | 1);
            occupation_info?: (0 | 1);
            destruction_level?: (0 | 1);
            civilian_impact?: (0 | 1);
            mass_graves_info?: (0 | 1);
            war_crimes_events?: (0 | 1);
            liberation_info?: (0 | 1);
          };
          attackedByReports?: {
            _id?: (0 | 1);
            title?: (0 | 1);
            description?: (0 | 1);
            location?: (0 | 1);
            address?: (0 | 1);
            status?: (0 | 1);
            priority?: (0 | 1);
            selected_language?: (0 | 1);
            crime_occurred_at?: (0 | 1);
          };
        };
      };


      update: {
        set: {
          _id: string;
          name?: string;
          english_name?: string;
          wars_history?: string;
          conflict_timeline?: string;
          casualties_info?: string;
          notable_battles?: string;
          occupation_info?: string;
          destruction_level?: string;
          civilian_impact?: string;
          mass_graves_info?: string;
          war_crimes_events?: string;
          liberation_info?: string;
        };
        get: {
          _id?: (0 | 1);
          name?: (0 | 1);
          english_name?: (0 | 1);
          createdAt?: (0 | 1);
          updatedAt?: (0 | 1);
          wars_history?: (0 | 1);
          conflict_timeline?: (0 | 1);
          casualties_info?: (0 | 1);
          notable_battles?: (0 | 1);
          occupation_info?: (0 | 1);
          destruction_level?: (0 | 1);
          civilian_impact?: (0 | 1);
          mass_graves_info?: (0 | 1);
          war_crimes_events?: (0 | 1);
          liberation_info?: (0 | 1);
          registrar?: {
            _id?: (0 | 1);
            first_name?: (0 | 1);
            last_name?: (0 | 1);
            gender?: (0 | 1);
            address?: (0 | 1);
            level?: (0 | 1);
            email?: (0 | 1);
            is_verified?: (0 | 1);
          };
          country?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
            createdAt?: (0 | 1);
            updatedAt?: (0 | 1);
            wars_history?: (0 | 1);
            conflict_timeline?: (0 | 1);
            casualties_info?: (0 | 1);
            international_response?: (0 | 1);
            war_crimes_documentation?: (0 | 1);
            human_rights_violations?: (0 | 1);
            genocide_info?: (0 | 1);
            chemical_weapons_info?: (0 | 1);
            displacement_info?: (0 | 1);
            reconstruction_status?: (0 | 1);
            international_sanctions?: (0 | 1);
            notable_war_events?: (0 | 1);
          };
          users?: {
            _id?: (0 | 1);
            first_name?: (0 | 1);
            last_name?: (0 | 1);
            gender?: (0 | 1);
            address?: (0 | 1);
            level?: (0 | 1);
            email?: (0 | 1);
            is_verified?: (0 | 1);
          };
          cities?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
            createdAt?: (0 | 1);
            updatedAt?: (0 | 1);
            wars_history?: (0 | 1);
            conflict_timeline?: (0 | 1);
            casualties_info?: (0 | 1);
            notable_battles?: (0 | 1);
            occupation_info?: (0 | 1);
            destruction_level?: (0 | 1);
            civilian_impact?: (0 | 1);
            mass_graves_info?: (0 | 1);
            war_crimes_events?: (0 | 1);
            liberation_info?: (0 | 1);
          };
          capital?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
            createdAt?: (0 | 1);
            updatedAt?: (0 | 1);
            wars_history?: (0 | 1);
            conflict_timeline?: (0 | 1);
            casualties_info?: (0 | 1);
            notable_battles?: (0 | 1);
            occupation_info?: (0 | 1);
            destruction_level?: (0 | 1);
            civilian_impact?: (0 | 1);
            mass_graves_info?: (0 | 1);
            war_crimes_events?: (0 | 1);
            liberation_info?: (0 | 1);
          };
          attackedByReports?: {
            _id?: (0 | 1);
            title?: (0 | 1);
            description?: (0 | 1);
            location?: (0 | 1);
            address?: (0 | 1);
            status?: (0 | 1);
            priority?: (0 | 1);
            selected_language?: (0 | 1);
            crime_occurred_at?: (0 | 1);
          };
        };
      };


      updateRelations: {
        set: {
          _id: string;
          country?: string;
        };
        get: {
          _id?: (0 | 1);
          name?: (0 | 1);
          english_name?: (0 | 1);
          createdAt?: (0 | 1);
          updatedAt?: (0 | 1);
          wars_history?: (0 | 1);
          conflict_timeline?: (0 | 1);
          casualties_info?: (0 | 1);
          notable_battles?: (0 | 1);
          occupation_info?: (0 | 1);
          destruction_level?: (0 | 1);
          civilian_impact?: (0 | 1);
          mass_graves_info?: (0 | 1);
          war_crimes_events?: (0 | 1);
          liberation_info?: (0 | 1);
          registrar?: {
            _id?: (0 | 1);
            first_name?: (0 | 1);
            last_name?: (0 | 1);
            gender?: (0 | 1);
            address?: (0 | 1);
            level?: (0 | 1);
            email?: (0 | 1);
            is_verified?: (0 | 1);
            avatar?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            national_card?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            province?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            city?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            uploadedAssets?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            reports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
            blogPosts?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              slug?: (0 | 1);
              content?: (0 | 1);
              isPublished?: (0 | 1);
              isFeatured?: (0 | 1);
              publishedAt?: (0 | 1);
            };
          };
          country?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
            createdAt?: (0 | 1);
            updatedAt?: (0 | 1);
            wars_history?: (0 | 1);
            conflict_timeline?: (0 | 1);
            casualties_info?: (0 | 1);
            international_response?: (0 | 1);
            war_crimes_documentation?: (0 | 1);
            human_rights_violations?: (0 | 1);
            genocide_info?: (0 | 1);
            chemical_weapons_info?: (0 | 1);
            displacement_info?: (0 | 1);
            reconstruction_status?: (0 | 1);
            international_sanctions?: (0 | 1);
            notable_war_events?: (0 | 1);
            registrar?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            provinces?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              createdAt?: (0 | 1);
              updatedAt?: (0 | 1);
              wars_history?: (0 | 1);
              conflict_timeline?: (0 | 1);
              casualties_info?: (0 | 1);
              notable_battles?: (0 | 1);
              occupation_info?: (0 | 1);
              destruction_level?: (0 | 1);
              civilian_impact?: (0 | 1);
              mass_graves_info?: (0 | 1);
              war_crimes_events?: (0 | 1);
              liberation_info?: (0 | 1);
            };
            hostileReports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
            attackedReports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
          };
          users?: {
            _id?: (0 | 1);
            first_name?: (0 | 1);
            last_name?: (0 | 1);
            gender?: (0 | 1);
            address?: (0 | 1);
            level?: (0 | 1);
            email?: (0 | 1);
            is_verified?: (0 | 1);
            avatar?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            national_card?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            province?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            city?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            uploadedAssets?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            reports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
            blogPosts?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              slug?: (0 | 1);
              content?: (0 | 1);
              isPublished?: (0 | 1);
              isFeatured?: (0 | 1);
              publishedAt?: (0 | 1);
            };
          };
          cities?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
            createdAt?: (0 | 1);
            updatedAt?: (0 | 1);
            wars_history?: (0 | 1);
            conflict_timeline?: (0 | 1);
            casualties_info?: (0 | 1);
            notable_battles?: (0 | 1);
            occupation_info?: (0 | 1);
            destruction_level?: (0 | 1);
            civilian_impact?: (0 | 1);
            mass_graves_info?: (0 | 1);
            war_crimes_events?: (0 | 1);
            liberation_info?: (0 | 1);
            registrar?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            province?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              createdAt?: (0 | 1);
              updatedAt?: (0 | 1);
              wars_history?: (0 | 1);
              conflict_timeline?: (0 | 1);
              casualties_info?: (0 | 1);
              notable_battles?: (0 | 1);
              occupation_info?: (0 | 1);
              destruction_level?: (0 | 1);
              civilian_impact?: (0 | 1);
              mass_graves_info?: (0 | 1);
              war_crimes_events?: (0 | 1);
              liberation_info?: (0 | 1);
            };
            users?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            attackedByReports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
          };
          capital?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
            createdAt?: (0 | 1);
            updatedAt?: (0 | 1);
            wars_history?: (0 | 1);
            conflict_timeline?: (0 | 1);
            casualties_info?: (0 | 1);
            notable_battles?: (0 | 1);
            occupation_info?: (0 | 1);
            destruction_level?: (0 | 1);
            civilian_impact?: (0 | 1);
            mass_graves_info?: (0 | 1);
            war_crimes_events?: (0 | 1);
            liberation_info?: (0 | 1);
            registrar?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            province?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              createdAt?: (0 | 1);
              updatedAt?: (0 | 1);
              wars_history?: (0 | 1);
              conflict_timeline?: (0 | 1);
              casualties_info?: (0 | 1);
              notable_battles?: (0 | 1);
              occupation_info?: (0 | 1);
              destruction_level?: (0 | 1);
              civilian_impact?: (0 | 1);
              mass_graves_info?: (0 | 1);
              war_crimes_events?: (0 | 1);
              liberation_info?: (0 | 1);
            };
            users?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            attackedByReports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
          };
          attackedByReports?: {
            _id?: (0 | 1);
            title?: (0 | 1);
            description?: (0 | 1);
            location?: (0 | 1);
            address?: (0 | 1);
            status?: (0 | 1);
            priority?: (0 | 1);
            selected_language?: (0 | 1);
            crime_occurred_at?: (0 | 1);
            reporter?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            documents?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              selected_language?: (0 | 1);
            };
            tags?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              color?: (0 | 1);
              icon?: (0 | 1);
            };
            category?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              color?: (0 | 1);
              icon?: (0 | 1);
            };
            hostileCountries?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              international_response?: (0 | 1);
              war_crimes_documentation?: (0 | 1);
              human_rights_violations?: (0 | 1);
              genocide_info?: (0 | 1);
              chemical_weapons_info?: (0 | 1);
              displacement_info?: (0 | 1);
              reconstruction_status?: (0 | 1);
              international_sanctions?: (0 | 1);
              notable_war_events?: (0 | 1);
            };
            attackedCountries?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              international_response?: (0 | 1);
              war_crimes_documentation?: (0 | 1);
              human_rights_violations?: (0 | 1);
              genocide_info?: (0 | 1);
              chemical_weapons_info?: (0 | 1);
              displacement_info?: (0 | 1);
              reconstruction_status?: (0 | 1);
              international_sanctions?: (0 | 1);
              notable_war_events?: (0 | 1);
            };
            attackedProvinces?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            attackedCities?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
          };
        };
      };


      get: {
        set: {
          _id: string;
        };
        get: {
          _id?: (0 | 1);
          name?: (0 | 1);
          english_name?: (0 | 1);
          createdAt?: (0 | 1);
          updatedAt?: (0 | 1);
          wars_history?: (0 | 1);
          conflict_timeline?: (0 | 1);
          casualties_info?: (0 | 1);
          notable_battles?: (0 | 1);
          occupation_info?: (0 | 1);
          destruction_level?: (0 | 1);
          civilian_impact?: (0 | 1);
          mass_graves_info?: (0 | 1);
          war_crimes_events?: (0 | 1);
          liberation_info?: (0 | 1);
          registrar?: {
            _id?: (0 | 1);
            first_name?: (0 | 1);
            last_name?: (0 | 1);
            gender?: (0 | 1);
            address?: (0 | 1);
            level?: (0 | 1);
            email?: (0 | 1);
            is_verified?: (0 | 1);
            avatar?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            national_card?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            province?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            city?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            uploadedAssets?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            reports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
            blogPosts?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              slug?: (0 | 1);
              content?: (0 | 1);
              isPublished?: (0 | 1);
              isFeatured?: (0 | 1);
              publishedAt?: (0 | 1);
            };
          };
          country?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
            createdAt?: (0 | 1);
            updatedAt?: (0 | 1);
            wars_history?: (0 | 1);
            conflict_timeline?: (0 | 1);
            casualties_info?: (0 | 1);
            international_response?: (0 | 1);
            war_crimes_documentation?: (0 | 1);
            human_rights_violations?: (0 | 1);
            genocide_info?: (0 | 1);
            chemical_weapons_info?: (0 | 1);
            displacement_info?: (0 | 1);
            reconstruction_status?: (0 | 1);
            international_sanctions?: (0 | 1);
            notable_war_events?: (0 | 1);
            registrar?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            provinces?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              createdAt?: (0 | 1);
              updatedAt?: (0 | 1);
              wars_history?: (0 | 1);
              conflict_timeline?: (0 | 1);
              casualties_info?: (0 | 1);
              notable_battles?: (0 | 1);
              occupation_info?: (0 | 1);
              destruction_level?: (0 | 1);
              civilian_impact?: (0 | 1);
              mass_graves_info?: (0 | 1);
              war_crimes_events?: (0 | 1);
              liberation_info?: (0 | 1);
            };
            hostileReports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
            attackedReports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
          };
          users?: {
            _id?: (0 | 1);
            first_name?: (0 | 1);
            last_name?: (0 | 1);
            gender?: (0 | 1);
            address?: (0 | 1);
            level?: (0 | 1);
            email?: (0 | 1);
            is_verified?: (0 | 1);
            avatar?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            national_card?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            province?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            city?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            uploadedAssets?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            reports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
            blogPosts?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              slug?: (0 | 1);
              content?: (0 | 1);
              isPublished?: (0 | 1);
              isFeatured?: (0 | 1);
              publishedAt?: (0 | 1);
            };
          };
          cities?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
            createdAt?: (0 | 1);
            updatedAt?: (0 | 1);
            wars_history?: (0 | 1);
            conflict_timeline?: (0 | 1);
            casualties_info?: (0 | 1);
            notable_battles?: (0 | 1);
            occupation_info?: (0 | 1);
            destruction_level?: (0 | 1);
            civilian_impact?: (0 | 1);
            mass_graves_info?: (0 | 1);
            war_crimes_events?: (0 | 1);
            liberation_info?: (0 | 1);
            registrar?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            province?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              createdAt?: (0 | 1);
              updatedAt?: (0 | 1);
              wars_history?: (0 | 1);
              conflict_timeline?: (0 | 1);
              casualties_info?: (0 | 1);
              notable_battles?: (0 | 1);
              occupation_info?: (0 | 1);
              destruction_level?: (0 | 1);
              civilian_impact?: (0 | 1);
              mass_graves_info?: (0 | 1);
              war_crimes_events?: (0 | 1);
              liberation_info?: (0 | 1);
            };
            users?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            attackedByReports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
          };
          capital?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
            createdAt?: (0 | 1);
            updatedAt?: (0 | 1);
            wars_history?: (0 | 1);
            conflict_timeline?: (0 | 1);
            casualties_info?: (0 | 1);
            notable_battles?: (0 | 1);
            occupation_info?: (0 | 1);
            destruction_level?: (0 | 1);
            civilian_impact?: (0 | 1);
            mass_graves_info?: (0 | 1);
            war_crimes_events?: (0 | 1);
            liberation_info?: (0 | 1);
            registrar?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            province?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              createdAt?: (0 | 1);
              updatedAt?: (0 | 1);
              wars_history?: (0 | 1);
              conflict_timeline?: (0 | 1);
              casualties_info?: (0 | 1);
              notable_battles?: (0 | 1);
              occupation_info?: (0 | 1);
              destruction_level?: (0 | 1);
              civilian_impact?: (0 | 1);
              mass_graves_info?: (0 | 1);
              war_crimes_events?: (0 | 1);
              liberation_info?: (0 | 1);
            };
            users?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            attackedByReports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
          };
          attackedByReports?: {
            _id?: (0 | 1);
            title?: (0 | 1);
            description?: (0 | 1);
            location?: (0 | 1);
            address?: (0 | 1);
            status?: (0 | 1);
            priority?: (0 | 1);
            selected_language?: (0 | 1);
            crime_occurred_at?: (0 | 1);
            reporter?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            documents?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              selected_language?: (0 | 1);
            };
            tags?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              color?: (0 | 1);
              icon?: (0 | 1);
            };
            category?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              color?: (0 | 1);
              icon?: (0 | 1);
            };
            hostileCountries?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              international_response?: (0 | 1);
              war_crimes_documentation?: (0 | 1);
              human_rights_violations?: (0 | 1);
              genocide_info?: (0 | 1);
              chemical_weapons_info?: (0 | 1);
              displacement_info?: (0 | 1);
              reconstruction_status?: (0 | 1);
              international_sanctions?: (0 | 1);
              notable_war_events?: (0 | 1);
            };
            attackedCountries?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              international_response?: (0 | 1);
              war_crimes_documentation?: (0 | 1);
              human_rights_violations?: (0 | 1);
              genocide_info?: (0 | 1);
              chemical_weapons_info?: (0 | 1);
              displacement_info?: (0 | 1);
              reconstruction_status?: (0 | 1);
              international_sanctions?: (0 | 1);
              notable_war_events?: (0 | 1);
            };
            attackedProvinces?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            attackedCities?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
          };
        };
      };


      gets: {
        set: {
          page: number;
          limit: number;
          name?: string;
          countryId?: string;
        };
        get: {
          _id?: (0 | 1);
          name?: (0 | 1);
          english_name?: (0 | 1);
          createdAt?: (0 | 1);
          updatedAt?: (0 | 1);
          wars_history?: (0 | 1);
          conflict_timeline?: (0 | 1);
          casualties_info?: (0 | 1);
          notable_battles?: (0 | 1);
          occupation_info?: (0 | 1);
          destruction_level?: (0 | 1);
          civilian_impact?: (0 | 1);
          mass_graves_info?: (0 | 1);
          war_crimes_events?: (0 | 1);
          liberation_info?: (0 | 1);
          registrar?: {
            _id?: (0 | 1);
            first_name?: (0 | 1);
            last_name?: (0 | 1);
            gender?: (0 | 1);
            address?: (0 | 1);
            level?: (0 | 1);
            email?: (0 | 1);
            is_verified?: (0 | 1);
            avatar?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            national_card?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            province?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            city?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            uploadedAssets?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            reports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
            blogPosts?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              slug?: (0 | 1);
              content?: (0 | 1);
              isPublished?: (0 | 1);
              isFeatured?: (0 | 1);
              publishedAt?: (0 | 1);
            };
          };
          country?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
            createdAt?: (0 | 1);
            updatedAt?: (0 | 1);
            wars_history?: (0 | 1);
            conflict_timeline?: (0 | 1);
            casualties_info?: (0 | 1);
            international_response?: (0 | 1);
            war_crimes_documentation?: (0 | 1);
            human_rights_violations?: (0 | 1);
            genocide_info?: (0 | 1);
            chemical_weapons_info?: (0 | 1);
            displacement_info?: (0 | 1);
            reconstruction_status?: (0 | 1);
            international_sanctions?: (0 | 1);
            notable_war_events?: (0 | 1);
            registrar?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            provinces?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              createdAt?: (0 | 1);
              updatedAt?: (0 | 1);
              wars_history?: (0 | 1);
              conflict_timeline?: (0 | 1);
              casualties_info?: (0 | 1);
              notable_battles?: (0 | 1);
              occupation_info?: (0 | 1);
              destruction_level?: (0 | 1);
              civilian_impact?: (0 | 1);
              mass_graves_info?: (0 | 1);
              war_crimes_events?: (0 | 1);
              liberation_info?: (0 | 1);
            };
            hostileReports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
            attackedReports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
          };
          users?: {
            _id?: (0 | 1);
            first_name?: (0 | 1);
            last_name?: (0 | 1);
            gender?: (0 | 1);
            address?: (0 | 1);
            level?: (0 | 1);
            email?: (0 | 1);
            is_verified?: (0 | 1);
            avatar?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            national_card?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            province?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            city?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            uploadedAssets?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            reports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
            blogPosts?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              slug?: (0 | 1);
              content?: (0 | 1);
              isPublished?: (0 | 1);
              isFeatured?: (0 | 1);
              publishedAt?: (0 | 1);
            };
          };
          cities?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
            createdAt?: (0 | 1);
            updatedAt?: (0 | 1);
            wars_history?: (0 | 1);
            conflict_timeline?: (0 | 1);
            casualties_info?: (0 | 1);
            notable_battles?: (0 | 1);
            occupation_info?: (0 | 1);
            destruction_level?: (0 | 1);
            civilian_impact?: (0 | 1);
            mass_graves_info?: (0 | 1);
            war_crimes_events?: (0 | 1);
            liberation_info?: (0 | 1);
            registrar?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            province?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              createdAt?: (0 | 1);
              updatedAt?: (0 | 1);
              wars_history?: (0 | 1);
              conflict_timeline?: (0 | 1);
              casualties_info?: (0 | 1);
              notable_battles?: (0 | 1);
              occupation_info?: (0 | 1);
              destruction_level?: (0 | 1);
              civilian_impact?: (0 | 1);
              mass_graves_info?: (0 | 1);
              war_crimes_events?: (0 | 1);
              liberation_info?: (0 | 1);
            };
            users?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            attackedByReports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
          };
          capital?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
            createdAt?: (0 | 1);
            updatedAt?: (0 | 1);
            wars_history?: (0 | 1);
            conflict_timeline?: (0 | 1);
            casualties_info?: (0 | 1);
            notable_battles?: (0 | 1);
            occupation_info?: (0 | 1);
            destruction_level?: (0 | 1);
            civilian_impact?: (0 | 1);
            mass_graves_info?: (0 | 1);
            war_crimes_events?: (0 | 1);
            liberation_info?: (0 | 1);
            registrar?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            province?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              createdAt?: (0 | 1);
              updatedAt?: (0 | 1);
              wars_history?: (0 | 1);
              conflict_timeline?: (0 | 1);
              casualties_info?: (0 | 1);
              notable_battles?: (0 | 1);
              occupation_info?: (0 | 1);
              destruction_level?: (0 | 1);
              civilian_impact?: (0 | 1);
              mass_graves_info?: (0 | 1);
              war_crimes_events?: (0 | 1);
              liberation_info?: (0 | 1);
            };
            users?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            attackedByReports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
          };
          attackedByReports?: {
            _id?: (0 | 1);
            title?: (0 | 1);
            description?: (0 | 1);
            location?: (0 | 1);
            address?: (0 | 1);
            status?: (0 | 1);
            priority?: (0 | 1);
            selected_language?: (0 | 1);
            crime_occurred_at?: (0 | 1);
            reporter?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            documents?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              selected_language?: (0 | 1);
            };
            tags?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              color?: (0 | 1);
              icon?: (0 | 1);
            };
            category?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              color?: (0 | 1);
              icon?: (0 | 1);
            };
            hostileCountries?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              international_response?: (0 | 1);
              war_crimes_documentation?: (0 | 1);
              human_rights_violations?: (0 | 1);
              genocide_info?: (0 | 1);
              chemical_weapons_info?: (0 | 1);
              displacement_info?: (0 | 1);
              reconstruction_status?: (0 | 1);
              international_sanctions?: (0 | 1);
              notable_war_events?: (0 | 1);
            };
            attackedCountries?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              international_response?: (0 | 1);
              war_crimes_documentation?: (0 | 1);
              human_rights_violations?: (0 | 1);
              genocide_info?: (0 | 1);
              chemical_weapons_info?: (0 | 1);
              displacement_info?: (0 | 1);
              reconstruction_status?: (0 | 1);
              international_sanctions?: (0 | 1);
              notable_war_events?: (0 | 1);
            };
            attackedProvinces?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            attackedCities?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
          };
        };
      };


      remove: {
        set: {
          _id: string;
          hardCascade?: boolean;
        };
        get: {
          success?: (0 | 1);
        };
      };


      count: {
        set: {
          name?: string;
        };
        get: {
          qty?: (0 | 1);
        };
      };


    }


    user: {


      addUser: {
        set: {
          first_name: string;
          last_name: string;
          father_name: string;
          mobile: string;
          gender: ("Male" | "Female");
          birth_date?: Date;
          summary?: string;
          national_number: string;
          address: string;
          level: ("Ghost" | "Manager" | "Editor" | "Ordinary");
          is_verified: boolean;
          nationalCard?: string;
          avatar?: string;
          provinceId?: string;
          cityId?: string;
        };
        get: {
          _id?: (0 | 1);
          first_name?: (0 | 1);
          last_name?: (0 | 1);
          father_name?: (0 | 1);
          gender?: (0 | 1);
          birth_date?: (0 | 1);
          summary?: (0 | 1);
          address?: (0 | 1);
          level?: (0 | 1);
          email?: (0 | 1);
          is_verified?: (0 | 1);
          createdAt?: (0 | 1);
          updatedAt?: (0 | 1);
          avatar?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            mimeType?: (0 | 1);
            type?: (0 | 1);
            alt_text?: (0 | 1);
          };
          national_card?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            mimeType?: (0 | 1);
            type?: (0 | 1);
            alt_text?: (0 | 1);
          };
          province?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
          };
          city?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
          };
          uploadedAssets?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            mimeType?: (0 | 1);
            type?: (0 | 1);
            alt_text?: (0 | 1);
          };
          reports?: {
            _id?: (0 | 1);
            title?: (0 | 1);
            description?: (0 | 1);
            location?: (0 | 1);
            address?: (0 | 1);
            status?: (0 | 1);
            priority?: (0 | 1);
            selected_language?: (0 | 1);
            crime_occurred_at?: (0 | 1);
          };
          blogPosts?: {
            _id?: (0 | 1);
            title?: (0 | 1);
            slug?: (0 | 1);
            content?: (0 | 1);
            isPublished?: (0 | 1);
            isFeatured?: (0 | 1);
            publishedAt?: (0 | 1);
          };
        };
      };


      getMe: {
        set: {
        };
        get: {
          _id?: (0 | 1);
          first_name?: (0 | 1);
          last_name?: (0 | 1);
          father_name?: (0 | 1);
          gender?: (0 | 1);
          birth_date?: (0 | 1);
          summary?: (0 | 1);
          address?: (0 | 1);
          level?: (0 | 1);
          email?: (0 | 1);
          is_verified?: (0 | 1);
          createdAt?: (0 | 1);
          updatedAt?: (0 | 1);
          avatar?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            mimeType?: (0 | 1);
            type?: (0 | 1);
            alt_text?: (0 | 1);
            uploader?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
          };
          national_card?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            mimeType?: (0 | 1);
            type?: (0 | 1);
            alt_text?: (0 | 1);
            uploader?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
          };
          province?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
            registrar?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            country?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              createdAt?: (0 | 1);
              updatedAt?: (0 | 1);
              wars_history?: (0 | 1);
              conflict_timeline?: (0 | 1);
              casualties_info?: (0 | 1);
              international_response?: (0 | 1);
              war_crimes_documentation?: (0 | 1);
              human_rights_violations?: (0 | 1);
              genocide_info?: (0 | 1);
              chemical_weapons_info?: (0 | 1);
              displacement_info?: (0 | 1);
              reconstruction_status?: (0 | 1);
              international_sanctions?: (0 | 1);
              notable_war_events?: (0 | 1);
            };
            users?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            cities?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              createdAt?: (0 | 1);
              updatedAt?: (0 | 1);
              wars_history?: (0 | 1);
              conflict_timeline?: (0 | 1);
              casualties_info?: (0 | 1);
              notable_battles?: (0 | 1);
              occupation_info?: (0 | 1);
              destruction_level?: (0 | 1);
              civilian_impact?: (0 | 1);
              mass_graves_info?: (0 | 1);
              war_crimes_events?: (0 | 1);
              liberation_info?: (0 | 1);
            };
            capital?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              createdAt?: (0 | 1);
              updatedAt?: (0 | 1);
              wars_history?: (0 | 1);
              conflict_timeline?: (0 | 1);
              casualties_info?: (0 | 1);
              notable_battles?: (0 | 1);
              occupation_info?: (0 | 1);
              destruction_level?: (0 | 1);
              civilian_impact?: (0 | 1);
              mass_graves_info?: (0 | 1);
              war_crimes_events?: (0 | 1);
              liberation_info?: (0 | 1);
            };
            attackedByReports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
          };
          city?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
            registrar?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            province?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              createdAt?: (0 | 1);
              updatedAt?: (0 | 1);
              wars_history?: (0 | 1);
              conflict_timeline?: (0 | 1);
              casualties_info?: (0 | 1);
              notable_battles?: (0 | 1);
              occupation_info?: (0 | 1);
              destruction_level?: (0 | 1);
              civilian_impact?: (0 | 1);
              mass_graves_info?: (0 | 1);
              war_crimes_events?: (0 | 1);
              liberation_info?: (0 | 1);
            };
            users?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            attackedByReports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
          };
          uploadedAssets?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            mimeType?: (0 | 1);
            type?: (0 | 1);
            alt_text?: (0 | 1);
            uploader?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
          };
          reports?: {
            _id?: (0 | 1);
            title?: (0 | 1);
            description?: (0 | 1);
            location?: (0 | 1);
            address?: (0 | 1);
            status?: (0 | 1);
            priority?: (0 | 1);
            selected_language?: (0 | 1);
            crime_occurred_at?: (0 | 1);
            reporter?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            documents?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              selected_language?: (0 | 1);
            };
            tags?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              color?: (0 | 1);
              icon?: (0 | 1);
            };
            category?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              color?: (0 | 1);
              icon?: (0 | 1);
            };
            hostileCountries?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              international_response?: (0 | 1);
              war_crimes_documentation?: (0 | 1);
              human_rights_violations?: (0 | 1);
              genocide_info?: (0 | 1);
              chemical_weapons_info?: (0 | 1);
              displacement_info?: (0 | 1);
              reconstruction_status?: (0 | 1);
              international_sanctions?: (0 | 1);
              notable_war_events?: (0 | 1);
            };
            attackedCountries?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              international_response?: (0 | 1);
              war_crimes_documentation?: (0 | 1);
              human_rights_violations?: (0 | 1);
              genocide_info?: (0 | 1);
              chemical_weapons_info?: (0 | 1);
              displacement_info?: (0 | 1);
              reconstruction_status?: (0 | 1);
              international_sanctions?: (0 | 1);
              notable_war_events?: (0 | 1);
            };
            attackedProvinces?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            attackedCities?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
          };
          blogPosts?: {
            _id?: (0 | 1);
            title?: (0 | 1);
            slug?: (0 | 1);
            content?: (0 | 1);
            isPublished?: (0 | 1);
            isFeatured?: (0 | 1);
            publishedAt?: (0 | 1);
            author?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            coverImage?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            tags?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              color?: (0 | 1);
              icon?: (0 | 1);
            };
          };
        };
      };


      getUser: {
        set: {
          _id: string;
        };
        get: {
          _id?: (0 | 1);
          first_name?: (0 | 1);
          last_name?: (0 | 1);
          father_name?: (0 | 1);
          gender?: (0 | 1);
          birth_date?: (0 | 1);
          summary?: (0 | 1);
          address?: (0 | 1);
          level?: (0 | 1);
          email?: (0 | 1);
          is_verified?: (0 | 1);
          createdAt?: (0 | 1);
          updatedAt?: (0 | 1);
          avatar?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            mimeType?: (0 | 1);
            type?: (0 | 1);
            alt_text?: (0 | 1);
            uploader?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
          };
          national_card?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            mimeType?: (0 | 1);
            type?: (0 | 1);
            alt_text?: (0 | 1);
            uploader?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
          };
          province?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
            registrar?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            country?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              createdAt?: (0 | 1);
              updatedAt?: (0 | 1);
              wars_history?: (0 | 1);
              conflict_timeline?: (0 | 1);
              casualties_info?: (0 | 1);
              international_response?: (0 | 1);
              war_crimes_documentation?: (0 | 1);
              human_rights_violations?: (0 | 1);
              genocide_info?: (0 | 1);
              chemical_weapons_info?: (0 | 1);
              displacement_info?: (0 | 1);
              reconstruction_status?: (0 | 1);
              international_sanctions?: (0 | 1);
              notable_war_events?: (0 | 1);
            };
            users?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            cities?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              createdAt?: (0 | 1);
              updatedAt?: (0 | 1);
              wars_history?: (0 | 1);
              conflict_timeline?: (0 | 1);
              casualties_info?: (0 | 1);
              notable_battles?: (0 | 1);
              occupation_info?: (0 | 1);
              destruction_level?: (0 | 1);
              civilian_impact?: (0 | 1);
              mass_graves_info?: (0 | 1);
              war_crimes_events?: (0 | 1);
              liberation_info?: (0 | 1);
            };
            capital?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              createdAt?: (0 | 1);
              updatedAt?: (0 | 1);
              wars_history?: (0 | 1);
              conflict_timeline?: (0 | 1);
              casualties_info?: (0 | 1);
              notable_battles?: (0 | 1);
              occupation_info?: (0 | 1);
              destruction_level?: (0 | 1);
              civilian_impact?: (0 | 1);
              mass_graves_info?: (0 | 1);
              war_crimes_events?: (0 | 1);
              liberation_info?: (0 | 1);
            };
            attackedByReports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
          };
          city?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
            registrar?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            province?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              createdAt?: (0 | 1);
              updatedAt?: (0 | 1);
              wars_history?: (0 | 1);
              conflict_timeline?: (0 | 1);
              casualties_info?: (0 | 1);
              notable_battles?: (0 | 1);
              occupation_info?: (0 | 1);
              destruction_level?: (0 | 1);
              civilian_impact?: (0 | 1);
              mass_graves_info?: (0 | 1);
              war_crimes_events?: (0 | 1);
              liberation_info?: (0 | 1);
            };
            users?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            attackedByReports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
          };
          uploadedAssets?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            mimeType?: (0 | 1);
            type?: (0 | 1);
            alt_text?: (0 | 1);
            uploader?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
          };
          reports?: {
            _id?: (0 | 1);
            title?: (0 | 1);
            description?: (0 | 1);
            location?: (0 | 1);
            address?: (0 | 1);
            status?: (0 | 1);
            priority?: (0 | 1);
            selected_language?: (0 | 1);
            crime_occurred_at?: (0 | 1);
            reporter?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            documents?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              selected_language?: (0 | 1);
            };
            tags?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              color?: (0 | 1);
              icon?: (0 | 1);
            };
            category?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              color?: (0 | 1);
              icon?: (0 | 1);
            };
            hostileCountries?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              international_response?: (0 | 1);
              war_crimes_documentation?: (0 | 1);
              human_rights_violations?: (0 | 1);
              genocide_info?: (0 | 1);
              chemical_weapons_info?: (0 | 1);
              displacement_info?: (0 | 1);
              reconstruction_status?: (0 | 1);
              international_sanctions?: (0 | 1);
              notable_war_events?: (0 | 1);
            };
            attackedCountries?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              international_response?: (0 | 1);
              war_crimes_documentation?: (0 | 1);
              human_rights_violations?: (0 | 1);
              genocide_info?: (0 | 1);
              chemical_weapons_info?: (0 | 1);
              displacement_info?: (0 | 1);
              reconstruction_status?: (0 | 1);
              international_sanctions?: (0 | 1);
              notable_war_events?: (0 | 1);
            };
            attackedProvinces?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            attackedCities?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
          };
          blogPosts?: {
            _id?: (0 | 1);
            title?: (0 | 1);
            slug?: (0 | 1);
            content?: (0 | 1);
            isPublished?: (0 | 1);
            isFeatured?: (0 | 1);
            publishedAt?: (0 | 1);
            author?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            coverImage?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            tags?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              color?: (0 | 1);
              icon?: (0 | 1);
            };
          };
        };
      };


      login: {
        set: {
          email: string;
          password: string;
        };
        get?: {
          token?: (0 | 1);
          user: {
            _id?: (0 | 1);
            first_name?: (0 | 1);
            last_name?: (0 | 1);
            father_name?: (0 | 1);
            gender?: (0 | 1);
            birth_date?: (0 | 1);
            summary?: (0 | 1);
            address?: (0 | 1);
            level?: (0 | 1);
            email?: (0 | 1);
            is_verified?: (0 | 1);
            createdAt?: (0 | 1);
            updatedAt?: (0 | 1);
            avatar?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            national_card?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            province?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            city?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            uploadedAssets?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            reports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
            blogPosts?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              slug?: (0 | 1);
              content?: (0 | 1);
              isPublished?: (0 | 1);
              isFeatured?: (0 | 1);
              publishedAt?: (0 | 1);
            };
          };
        };
      };


      tempUser: {
        set: {
          first_name: string;
          last_name: string;
          father_name?: string;
          gender: ("Male" | "Female");
          birth_date?: Date;
          summary?: string;
          address?: string;
          email: string;
          password: string;
          createdAt?: Date;
          updatedAt?: Date;
        };
        get: {
          _id?: (0 | 1);
          first_name?: (0 | 1);
          last_name?: (0 | 1);
          father_name?: (0 | 1);
          gender?: (0 | 1);
          birth_date?: (0 | 1);
          summary?: (0 | 1);
          address?: (0 | 1);
          level?: (0 | 1);
          email?: (0 | 1);
          is_verified?: (0 | 1);
          createdAt?: (0 | 1);
          updatedAt?: (0 | 1);
          avatar?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            mimeType?: (0 | 1);
            type?: (0 | 1);
            alt_text?: (0 | 1);
          };
          national_card?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            mimeType?: (0 | 1);
            type?: (0 | 1);
            alt_text?: (0 | 1);
          };
          province?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
          };
          city?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
          };
          uploadedAssets?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            mimeType?: (0 | 1);
            type?: (0 | 1);
            alt_text?: (0 | 1);
          };
          reports?: {
            _id?: (0 | 1);
            title?: (0 | 1);
            description?: (0 | 1);
            location?: (0 | 1);
            address?: (0 | 1);
            status?: (0 | 1);
            priority?: (0 | 1);
            selected_language?: (0 | 1);
            crime_occurred_at?: (0 | 1);
          };
          blogPosts?: {
            _id?: (0 | 1);
            title?: (0 | 1);
            slug?: (0 | 1);
            content?: (0 | 1);
            isPublished?: (0 | 1);
            isFeatured?: (0 | 1);
            publishedAt?: (0 | 1);
          };
        };
      };


      updateUser: {
        set: {
          _id: string;
          first_name?: string;
          last_name?: string;
          father_name?: string;
          gender?: ("Male" | "Female");
          birth_date?: Date;
          summary?: string;
          address?: string;
        };
        get: {
          _id?: (0 | 1);
          first_name?: (0 | 1);
          last_name?: (0 | 1);
          father_name?: (0 | 1);
          gender?: (0 | 1);
          birth_date?: (0 | 1);
          summary?: (0 | 1);
          address?: (0 | 1);
          level?: (0 | 1);
          email?: (0 | 1);
          is_verified?: (0 | 1);
          createdAt?: (0 | 1);
          updatedAt?: (0 | 1);
          avatar?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            mimeType?: (0 | 1);
            type?: (0 | 1);
            alt_text?: (0 | 1);
          };
          national_card?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            mimeType?: (0 | 1);
            type?: (0 | 1);
            alt_text?: (0 | 1);
          };
          province?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
          };
          city?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
          };
          uploadedAssets?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            mimeType?: (0 | 1);
            type?: (0 | 1);
            alt_text?: (0 | 1);
          };
          reports?: {
            _id?: (0 | 1);
            title?: (0 | 1);
            description?: (0 | 1);
            location?: (0 | 1);
            address?: (0 | 1);
            status?: (0 | 1);
            priority?: (0 | 1);
            selected_language?: (0 | 1);
            crime_occurred_at?: (0 | 1);
          };
          blogPosts?: {
            _id?: (0 | 1);
            title?: (0 | 1);
            slug?: (0 | 1);
            content?: (0 | 1);
            isPublished?: (0 | 1);
            isFeatured?: (0 | 1);
            publishedAt?: (0 | 1);
          };
        };
      };


      registerUser: {
        set: {
          first_name: string;
          last_name: string;
          father_name?: string;
          gender: ("Male" | "Female");
          birth_date?: Date;
          summary?: string;
          address?: string;
          email: string;
          password: string;
          createdAt?: Date;
          updatedAt?: Date;
        };
        get: {
          _id?: (0 | 1);
          first_name?: (0 | 1);
          last_name?: (0 | 1);
          father_name?: (0 | 1);
          gender?: (0 | 1);
          birth_date?: (0 | 1);
          summary?: (0 | 1);
          address?: (0 | 1);
          level?: (0 | 1);
          email?: (0 | 1);
          is_verified?: (0 | 1);
          createdAt?: (0 | 1);
          updatedAt?: (0 | 1);
          avatar?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            mimeType?: (0 | 1);
            type?: (0 | 1);
            alt_text?: (0 | 1);
          };
          national_card?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            mimeType?: (0 | 1);
            type?: (0 | 1);
            alt_text?: (0 | 1);
          };
          province?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
          };
          city?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
          };
          uploadedAssets?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            mimeType?: (0 | 1);
            type?: (0 | 1);
            alt_text?: (0 | 1);
          };
          reports?: {
            _id?: (0 | 1);
            title?: (0 | 1);
            description?: (0 | 1);
            location?: (0 | 1);
            address?: (0 | 1);
            status?: (0 | 1);
            priority?: (0 | 1);
            selected_language?: (0 | 1);
            crime_occurred_at?: (0 | 1);
          };
          blogPosts?: {
            _id?: (0 | 1);
            title?: (0 | 1);
            slug?: (0 | 1);
            content?: (0 | 1);
            isPublished?: (0 | 1);
            isFeatured?: (0 | 1);
            publishedAt?: (0 | 1);
          };
        };
      };


      getUsers: {
        set: {
          page?: number;
          limit?: number;
          skip?: number;
          search?: string;
          level?: ("Ghost" | "Manager" | "Editor" | "Ordinary");
          levels?: ("Ghost" | "Manager" | "Editor" | "Ordinary")[];
          isVerified?: ("true" | "false" | "all");
          gender?: ("Male" | "Female");
          sortBy?: ("createdAt" | "updatedAt" | "first_name" | "last_name" | "email" | "level");
          sortOrder?: ("asc" | "desc");
        };
        get: {
          _id?: (0 | 1);
          first_name?: (0 | 1);
          last_name?: (0 | 1);
          father_name?: (0 | 1);
          gender?: (0 | 1);
          birth_date?: (0 | 1);
          summary?: (0 | 1);
          address?: (0 | 1);
          level?: (0 | 1);
          email?: (0 | 1);
          is_verified?: (0 | 1);
          createdAt?: (0 | 1);
          updatedAt?: (0 | 1);
          avatar?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            mimeType?: (0 | 1);
            type?: (0 | 1);
            alt_text?: (0 | 1);
            uploader?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
          };
          national_card?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            mimeType?: (0 | 1);
            type?: (0 | 1);
            alt_text?: (0 | 1);
            uploader?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
          };
          province?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
            registrar?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            country?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              createdAt?: (0 | 1);
              updatedAt?: (0 | 1);
              wars_history?: (0 | 1);
              conflict_timeline?: (0 | 1);
              casualties_info?: (0 | 1);
              international_response?: (0 | 1);
              war_crimes_documentation?: (0 | 1);
              human_rights_violations?: (0 | 1);
              genocide_info?: (0 | 1);
              chemical_weapons_info?: (0 | 1);
              displacement_info?: (0 | 1);
              reconstruction_status?: (0 | 1);
              international_sanctions?: (0 | 1);
              notable_war_events?: (0 | 1);
            };
            users?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            cities?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              createdAt?: (0 | 1);
              updatedAt?: (0 | 1);
              wars_history?: (0 | 1);
              conflict_timeline?: (0 | 1);
              casualties_info?: (0 | 1);
              notable_battles?: (0 | 1);
              occupation_info?: (0 | 1);
              destruction_level?: (0 | 1);
              civilian_impact?: (0 | 1);
              mass_graves_info?: (0 | 1);
              war_crimes_events?: (0 | 1);
              liberation_info?: (0 | 1);
            };
            capital?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              createdAt?: (0 | 1);
              updatedAt?: (0 | 1);
              wars_history?: (0 | 1);
              conflict_timeline?: (0 | 1);
              casualties_info?: (0 | 1);
              notable_battles?: (0 | 1);
              occupation_info?: (0 | 1);
              destruction_level?: (0 | 1);
              civilian_impact?: (0 | 1);
              mass_graves_info?: (0 | 1);
              war_crimes_events?: (0 | 1);
              liberation_info?: (0 | 1);
            };
            attackedByReports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
          };
          city?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
            registrar?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            province?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              createdAt?: (0 | 1);
              updatedAt?: (0 | 1);
              wars_history?: (0 | 1);
              conflict_timeline?: (0 | 1);
              casualties_info?: (0 | 1);
              notable_battles?: (0 | 1);
              occupation_info?: (0 | 1);
              destruction_level?: (0 | 1);
              civilian_impact?: (0 | 1);
              mass_graves_info?: (0 | 1);
              war_crimes_events?: (0 | 1);
              liberation_info?: (0 | 1);
            };
            users?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            attackedByReports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
          };
          uploadedAssets?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            mimeType?: (0 | 1);
            type?: (0 | 1);
            alt_text?: (0 | 1);
            uploader?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
          };
          reports?: {
            _id?: (0 | 1);
            title?: (0 | 1);
            description?: (0 | 1);
            location?: (0 | 1);
            address?: (0 | 1);
            status?: (0 | 1);
            priority?: (0 | 1);
            selected_language?: (0 | 1);
            crime_occurred_at?: (0 | 1);
            reporter?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            documents?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              selected_language?: (0 | 1);
            };
            tags?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              color?: (0 | 1);
              icon?: (0 | 1);
            };
            category?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              color?: (0 | 1);
              icon?: (0 | 1);
            };
            hostileCountries?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              international_response?: (0 | 1);
              war_crimes_documentation?: (0 | 1);
              human_rights_violations?: (0 | 1);
              genocide_info?: (0 | 1);
              chemical_weapons_info?: (0 | 1);
              displacement_info?: (0 | 1);
              reconstruction_status?: (0 | 1);
              international_sanctions?: (0 | 1);
              notable_war_events?: (0 | 1);
            };
            attackedCountries?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              international_response?: (0 | 1);
              war_crimes_documentation?: (0 | 1);
              human_rights_violations?: (0 | 1);
              genocide_info?: (0 | 1);
              chemical_weapons_info?: (0 | 1);
              displacement_info?: (0 | 1);
              reconstruction_status?: (0 | 1);
              international_sanctions?: (0 | 1);
              notable_war_events?: (0 | 1);
            };
            attackedProvinces?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            attackedCities?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
          };
          blogPosts?: {
            _id?: (0 | 1);
            title?: (0 | 1);
            slug?: (0 | 1);
            content?: (0 | 1);
            isPublished?: (0 | 1);
            isFeatured?: (0 | 1);
            publishedAt?: (0 | 1);
            author?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            coverImage?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            tags?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              color?: (0 | 1);
              icon?: (0 | 1);
            };
          };
        };
      };


      removeUser: {
        set: {
          _id: string;
          hardCascade?: boolean;
        };
        get: {
          success?: (0 | 1);
        };
      };


      countUsers: {
        set: {
          levels?: ("Ghost" | "Manager" | "Editor" | "Ordinary")[];
        };
        get: {
          qty: (0 | 1);
        };
      };


      updateUserRelations: {
        set: {
          _id: string;
          avatar?: string;
          national_card?: string;
          province?: string;
          city?: string;
        };
        get: {
          _id?: (0 | 1);
          first_name?: (0 | 1);
          last_name?: (0 | 1);
          father_name?: (0 | 1);
          gender?: (0 | 1);
          birth_date?: (0 | 1);
          summary?: (0 | 1);
          address?: (0 | 1);
          level?: (0 | 1);
          email?: (0 | 1);
          is_verified?: (0 | 1);
          createdAt?: (0 | 1);
          updatedAt?: (0 | 1);
          avatar?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            mimeType?: (0 | 1);
            type?: (0 | 1);
            alt_text?: (0 | 1);
          };
          national_card?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            mimeType?: (0 | 1);
            type?: (0 | 1);
            alt_text?: (0 | 1);
          };
          province?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
          };
          city?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
          };
          uploadedAssets?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            mimeType?: (0 | 1);
            type?: (0 | 1);
            alt_text?: (0 | 1);
          };
          reports?: {
            _id?: (0 | 1);
            title?: (0 | 1);
            description?: (0 | 1);
            location?: (0 | 1);
            address?: (0 | 1);
            status?: (0 | 1);
            priority?: (0 | 1);
            selected_language?: (0 | 1);
            crime_occurred_at?: (0 | 1);
          };
          blogPosts?: {
            _id?: (0 | 1);
            title?: (0 | 1);
            slug?: (0 | 1);
            content?: (0 | 1);
            isPublished?: (0 | 1);
            isFeatured?: (0 | 1);
            publishedAt?: (0 | 1);
          };
        };
      };


      dashboardStatistic: {
        set: {
        };
        get: {
          users?: (0 | 1);
          provinces?: (0 | 1);
          cities?: (0 | 1);
          categories?: (0 | 1);
          tags?: (0 | 1);
        };
      };


    }


    tag: {


      add: {
        set: {
          name: string;
          description: string;
          color?: string;
          icon?: string;
          createdAt?: Date;
          updatedAt?: Date;
        };
        get: {
          _id?: (0 | 1);
          name?: (0 | 1);
          description?: (0 | 1);
          color?: (0 | 1);
          icon?: (0 | 1);
          createdAt?: (0 | 1);
          updatedAt?: (0 | 1);
          registrar?: {
            _id?: (0 | 1);
            first_name?: (0 | 1);
            last_name?: (0 | 1);
            gender?: (0 | 1);
            address?: (0 | 1);
            level?: (0 | 1);
            email?: (0 | 1);
            is_verified?: (0 | 1);
          };
          reports?: {
            _id?: (0 | 1);
            title?: (0 | 1);
            description?: (0 | 1);
            location?: (0 | 1);
            address?: (0 | 1);
            status?: (0 | 1);
            priority?: (0 | 1);
            selected_language?: (0 | 1);
            crime_occurred_at?: (0 | 1);
          };
          blogPosts?: {
            _id?: (0 | 1);
            title?: (0 | 1);
            slug?: (0 | 1);
            content?: (0 | 1);
            isPublished?: (0 | 1);
            isFeatured?: (0 | 1);
            publishedAt?: (0 | 1);
          };
        };
      };


      update: {
        set: {
          _id: string;
          name?: string;
          description?: string;
          color?: string;
          icon?: string;
        };
        get: {
          _id?: (0 | 1);
          name?: (0 | 1);
          description?: (0 | 1);
          color?: (0 | 1);
          icon?: (0 | 1);
          createdAt?: (0 | 1);
          updatedAt?: (0 | 1);
          registrar?: {
            _id?: (0 | 1);
            first_name?: (0 | 1);
            last_name?: (0 | 1);
            gender?: (0 | 1);
            address?: (0 | 1);
            level?: (0 | 1);
            email?: (0 | 1);
            is_verified?: (0 | 1);
          };
          reports?: {
            _id?: (0 | 1);
            title?: (0 | 1);
            description?: (0 | 1);
            location?: (0 | 1);
            address?: (0 | 1);
            status?: (0 | 1);
            priority?: (0 | 1);
            selected_language?: (0 | 1);
            crime_occurred_at?: (0 | 1);
          };
          blogPosts?: {
            _id?: (0 | 1);
            title?: (0 | 1);
            slug?: (0 | 1);
            content?: (0 | 1);
            isPublished?: (0 | 1);
            isFeatured?: (0 | 1);
            publishedAt?: (0 | 1);
          };
        };
      };


      get: {
        set: {
          _id: string;
        };
        get: {
          _id?: (0 | 1);
          name?: (0 | 1);
          description?: (0 | 1);
          color?: (0 | 1);
          icon?: (0 | 1);
          createdAt?: (0 | 1);
          updatedAt?: (0 | 1);
          registrar?: {
            _id?: (0 | 1);
            first_name?: (0 | 1);
            last_name?: (0 | 1);
            gender?: (0 | 1);
            address?: (0 | 1);
            level?: (0 | 1);
            email?: (0 | 1);
            is_verified?: (0 | 1);
            avatar?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            national_card?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            province?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            city?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            uploadedAssets?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            reports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
            blogPosts?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              slug?: (0 | 1);
              content?: (0 | 1);
              isPublished?: (0 | 1);
              isFeatured?: (0 | 1);
              publishedAt?: (0 | 1);
            };
          };
          reports?: {
            _id?: (0 | 1);
            title?: (0 | 1);
            description?: (0 | 1);
            location?: (0 | 1);
            address?: (0 | 1);
            status?: (0 | 1);
            priority?: (0 | 1);
            selected_language?: (0 | 1);
            crime_occurred_at?: (0 | 1);
            reporter?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            documents?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              selected_language?: (0 | 1);
            };
            tags?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              color?: (0 | 1);
              icon?: (0 | 1);
            };
            category?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              color?: (0 | 1);
              icon?: (0 | 1);
            };
            hostileCountries?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              international_response?: (0 | 1);
              war_crimes_documentation?: (0 | 1);
              human_rights_violations?: (0 | 1);
              genocide_info?: (0 | 1);
              chemical_weapons_info?: (0 | 1);
              displacement_info?: (0 | 1);
              reconstruction_status?: (0 | 1);
              international_sanctions?: (0 | 1);
              notable_war_events?: (0 | 1);
            };
            attackedCountries?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              international_response?: (0 | 1);
              war_crimes_documentation?: (0 | 1);
              human_rights_violations?: (0 | 1);
              genocide_info?: (0 | 1);
              chemical_weapons_info?: (0 | 1);
              displacement_info?: (0 | 1);
              reconstruction_status?: (0 | 1);
              international_sanctions?: (0 | 1);
              notable_war_events?: (0 | 1);
            };
            attackedProvinces?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            attackedCities?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
          };
          blogPosts?: {
            _id?: (0 | 1);
            title?: (0 | 1);
            slug?: (0 | 1);
            content?: (0 | 1);
            isPublished?: (0 | 1);
            isFeatured?: (0 | 1);
            publishedAt?: (0 | 1);
            author?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            coverImage?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            tags?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              color?: (0 | 1);
              icon?: (0 | 1);
            };
          };
        };
      };


      gets: {
        set: {
          page?: number;
          limit?: number;
          skip?: number;
          search?: string;
          sortBy?: ("createdAt" | "updatedAt" | "name");
          sortOrder?: ("asc" | "desc");
        };
        get: {
          _id?: (0 | 1);
          name?: (0 | 1);
          description?: (0 | 1);
          color?: (0 | 1);
          icon?: (0 | 1);
          createdAt?: (0 | 1);
          updatedAt?: (0 | 1);
          registrar?: {
            _id?: (0 | 1);
            first_name?: (0 | 1);
            last_name?: (0 | 1);
            gender?: (0 | 1);
            address?: (0 | 1);
            level?: (0 | 1);
            email?: (0 | 1);
            is_verified?: (0 | 1);
            avatar?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            national_card?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            province?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            city?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            uploadedAssets?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            reports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
            blogPosts?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              slug?: (0 | 1);
              content?: (0 | 1);
              isPublished?: (0 | 1);
              isFeatured?: (0 | 1);
              publishedAt?: (0 | 1);
            };
          };
          reports?: {
            _id?: (0 | 1);
            title?: (0 | 1);
            description?: (0 | 1);
            location?: (0 | 1);
            address?: (0 | 1);
            status?: (0 | 1);
            priority?: (0 | 1);
            selected_language?: (0 | 1);
            crime_occurred_at?: (0 | 1);
            reporter?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            documents?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              selected_language?: (0 | 1);
            };
            tags?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              color?: (0 | 1);
              icon?: (0 | 1);
            };
            category?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              color?: (0 | 1);
              icon?: (0 | 1);
            };
            hostileCountries?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              international_response?: (0 | 1);
              war_crimes_documentation?: (0 | 1);
              human_rights_violations?: (0 | 1);
              genocide_info?: (0 | 1);
              chemical_weapons_info?: (0 | 1);
              displacement_info?: (0 | 1);
              reconstruction_status?: (0 | 1);
              international_sanctions?: (0 | 1);
              notable_war_events?: (0 | 1);
            };
            attackedCountries?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              international_response?: (0 | 1);
              war_crimes_documentation?: (0 | 1);
              human_rights_violations?: (0 | 1);
              genocide_info?: (0 | 1);
              chemical_weapons_info?: (0 | 1);
              displacement_info?: (0 | 1);
              reconstruction_status?: (0 | 1);
              international_sanctions?: (0 | 1);
              notable_war_events?: (0 | 1);
            };
            attackedProvinces?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            attackedCities?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
          };
          blogPosts?: {
            _id?: (0 | 1);
            title?: (0 | 1);
            slug?: (0 | 1);
            content?: (0 | 1);
            isPublished?: (0 | 1);
            isFeatured?: (0 | 1);
            publishedAt?: (0 | 1);
            author?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            coverImage?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            tags?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              color?: (0 | 1);
              icon?: (0 | 1);
            };
          };
        };
      };


      remove: {
        set: {
          _id: string;
          hardCascade?: boolean;
        };
        get: {
          success?: (0 | 1);
        };
      };


      count: {
        set: {
          name?: string;
        };
        get: {
          qty?: (0 | 1);
        };
      };


    }


    category: {


      add: {
        set: {
          name: string;
          description: string;
          color?: string;
          icon?: string;
          createdAt?: Date;
          updatedAt?: Date;
        };
        get: {
          _id?: (0 | 1);
          name?: (0 | 1);
          description?: (0 | 1);
          color?: (0 | 1);
          icon?: (0 | 1);
          createdAt?: (0 | 1);
          updatedAt?: (0 | 1);
          registrar?: {
            _id?: (0 | 1);
            first_name?: (0 | 1);
            last_name?: (0 | 1);
            gender?: (0 | 1);
            address?: (0 | 1);
            level?: (0 | 1);
            email?: (0 | 1);
            is_verified?: (0 | 1);
          };
          reports?: {
            _id?: (0 | 1);
            title?: (0 | 1);
            description?: (0 | 1);
            location?: (0 | 1);
            address?: (0 | 1);
            status?: (0 | 1);
            priority?: (0 | 1);
            selected_language?: (0 | 1);
            crime_occurred_at?: (0 | 1);
          };
        };
      };


      update: {
        set: {
          _id: string;
          name?: string;
          description?: string;
          color?: string;
          icon?: string;
        };
        get: {
          _id?: (0 | 1);
          name?: (0 | 1);
          description?: (0 | 1);
          color?: (0 | 1);
          icon?: (0 | 1);
          createdAt?: (0 | 1);
          updatedAt?: (0 | 1);
          registrar?: {
            _id?: (0 | 1);
            first_name?: (0 | 1);
            last_name?: (0 | 1);
            gender?: (0 | 1);
            address?: (0 | 1);
            level?: (0 | 1);
            email?: (0 | 1);
            is_verified?: (0 | 1);
          };
          reports?: {
            _id?: (0 | 1);
            title?: (0 | 1);
            description?: (0 | 1);
            location?: (0 | 1);
            address?: (0 | 1);
            status?: (0 | 1);
            priority?: (0 | 1);
            selected_language?: (0 | 1);
            crime_occurred_at?: (0 | 1);
          };
        };
      };


      get: {
        set: {
          _id: string;
        };
        get: {
          _id?: (0 | 1);
          name?: (0 | 1);
          description?: (0 | 1);
          color?: (0 | 1);
          icon?: (0 | 1);
          createdAt?: (0 | 1);
          updatedAt?: (0 | 1);
          registrar?: {
            _id?: (0 | 1);
            first_name?: (0 | 1);
            last_name?: (0 | 1);
            gender?: (0 | 1);
            address?: (0 | 1);
            level?: (0 | 1);
            email?: (0 | 1);
            is_verified?: (0 | 1);
            avatar?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            national_card?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            province?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            city?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            uploadedAssets?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            reports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
            blogPosts?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              slug?: (0 | 1);
              content?: (0 | 1);
              isPublished?: (0 | 1);
              isFeatured?: (0 | 1);
              publishedAt?: (0 | 1);
            };
          };
          reports?: {
            _id?: (0 | 1);
            title?: (0 | 1);
            description?: (0 | 1);
            location?: (0 | 1);
            address?: (0 | 1);
            status?: (0 | 1);
            priority?: (0 | 1);
            selected_language?: (0 | 1);
            crime_occurred_at?: (0 | 1);
            reporter?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            documents?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              selected_language?: (0 | 1);
            };
            tags?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              color?: (0 | 1);
              icon?: (0 | 1);
            };
            category?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              color?: (0 | 1);
              icon?: (0 | 1);
            };
            hostileCountries?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              international_response?: (0 | 1);
              war_crimes_documentation?: (0 | 1);
              human_rights_violations?: (0 | 1);
              genocide_info?: (0 | 1);
              chemical_weapons_info?: (0 | 1);
              displacement_info?: (0 | 1);
              reconstruction_status?: (0 | 1);
              international_sanctions?: (0 | 1);
              notable_war_events?: (0 | 1);
            };
            attackedCountries?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              international_response?: (0 | 1);
              war_crimes_documentation?: (0 | 1);
              human_rights_violations?: (0 | 1);
              genocide_info?: (0 | 1);
              chemical_weapons_info?: (0 | 1);
              displacement_info?: (0 | 1);
              reconstruction_status?: (0 | 1);
              international_sanctions?: (0 | 1);
              notable_war_events?: (0 | 1);
            };
            attackedProvinces?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            attackedCities?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
          };
        };
      };


      gets: {
        set: {
          page?: number;
          limit?: number;
          skip?: number;
          search?: string;
          sortBy?: ("createdAt" | "updatedAt" | "name");
          sortOrder?: ("asc" | "desc");
        };
        get: {
          _id?: (0 | 1);
          name?: (0 | 1);
          description?: (0 | 1);
          color?: (0 | 1);
          icon?: (0 | 1);
          createdAt?: (0 | 1);
          updatedAt?: (0 | 1);
          registrar?: {
            _id?: (0 | 1);
            first_name?: (0 | 1);
            last_name?: (0 | 1);
            gender?: (0 | 1);
            address?: (0 | 1);
            level?: (0 | 1);
            email?: (0 | 1);
            is_verified?: (0 | 1);
            avatar?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            national_card?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            province?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            city?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            uploadedAssets?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            reports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
            blogPosts?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              slug?: (0 | 1);
              content?: (0 | 1);
              isPublished?: (0 | 1);
              isFeatured?: (0 | 1);
              publishedAt?: (0 | 1);
            };
          };
          reports?: {
            _id?: (0 | 1);
            title?: (0 | 1);
            description?: (0 | 1);
            location?: (0 | 1);
            address?: (0 | 1);
            status?: (0 | 1);
            priority?: (0 | 1);
            selected_language?: (0 | 1);
            crime_occurred_at?: (0 | 1);
            reporter?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            documents?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              selected_language?: (0 | 1);
            };
            tags?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              color?: (0 | 1);
              icon?: (0 | 1);
            };
            category?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              color?: (0 | 1);
              icon?: (0 | 1);
            };
            hostileCountries?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              international_response?: (0 | 1);
              war_crimes_documentation?: (0 | 1);
              human_rights_violations?: (0 | 1);
              genocide_info?: (0 | 1);
              chemical_weapons_info?: (0 | 1);
              displacement_info?: (0 | 1);
              reconstruction_status?: (0 | 1);
              international_sanctions?: (0 | 1);
              notable_war_events?: (0 | 1);
            };
            attackedCountries?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              international_response?: (0 | 1);
              war_crimes_documentation?: (0 | 1);
              human_rights_violations?: (0 | 1);
              genocide_info?: (0 | 1);
              chemical_weapons_info?: (0 | 1);
              displacement_info?: (0 | 1);
              reconstruction_status?: (0 | 1);
              international_sanctions?: (0 | 1);
              notable_war_events?: (0 | 1);
            };
            attackedProvinces?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            attackedCities?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
          };
        };
      };


      remove: {
        set: {
          _id: string;
          hardCascade?: boolean;
        };
        get: {
          success?: (0 | 1);
        };
      };


      count: {
        set: {
          name?: string;
        };
        get: {
          qty?: (0 | 1);
        };
      };


    }


    report: {


      add: {
        set: {
          title: string;
          description: string;
          location?: {
            type: "Point";
            coordinates: any[];
          };
          address?: string;
          status: ("Pending" | "Approved" | "Rejected" | "InReview");
          priority?: ("Low" | "Medium" | "High");
          selected_language: ("en" | "zh" | "hi" | "es" | "fr" | "ar" | "pt" | "ru" | "ja" | "pa" | "de" | "id" | "te" | "mr" | "tr" | "ta" | "vi" | "ko" | "it" | "fa" | "nl" | "sv" | "pl" | "uk" | "ro");
          crime_occurred_at: Date;
          createdAt?: Date;
          updatedAt?: Date;
          tags?: string[];
          category?: string;
          documentIds?: string[];
          hostileCountryIds?: string[];
          attackedCountryIds?: string[];
          attackedProvinceIds?: string[];
          attackedCityIds?: string[];
        };
        get: {
          _id?: (0 | 1);
          title?: (0 | 1);
          description?: (0 | 1);
          location?: (0 | 1);
          address?: (0 | 1);
          status?: (0 | 1);
          priority?: (0 | 1);
          selected_language?: (0 | 1);
          crime_occurred_at?: (0 | 1);
          createdAt?: (0 | 1);
          updatedAt?: (0 | 1);
          reporter?: {
            _id?: (0 | 1);
            first_name?: (0 | 1);
            last_name?: (0 | 1);
            gender?: (0 | 1);
            address?: (0 | 1);
            level?: (0 | 1);
            email?: (0 | 1);
            is_verified?: (0 | 1);
          };
          documents?: {
            _id?: (0 | 1);
            title?: (0 | 1);
            description?: (0 | 1);
            selected_language?: (0 | 1);
          };
          tags?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            color?: (0 | 1);
            icon?: (0 | 1);
          };
          category?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            color?: (0 | 1);
            icon?: (0 | 1);
          };
          hostileCountries?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
            international_response?: (0 | 1);
            war_crimes_documentation?: (0 | 1);
            human_rights_violations?: (0 | 1);
            genocide_info?: (0 | 1);
            chemical_weapons_info?: (0 | 1);
            displacement_info?: (0 | 1);
            reconstruction_status?: (0 | 1);
            international_sanctions?: (0 | 1);
            notable_war_events?: (0 | 1);
          };
          attackedCountries?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
            international_response?: (0 | 1);
            war_crimes_documentation?: (0 | 1);
            human_rights_violations?: (0 | 1);
            genocide_info?: (0 | 1);
            chemical_weapons_info?: (0 | 1);
            displacement_info?: (0 | 1);
            reconstruction_status?: (0 | 1);
            international_sanctions?: (0 | 1);
            notable_war_events?: (0 | 1);
          };
          attackedProvinces?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
          };
          attackedCities?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
          };
        };
      };


      get: {
        set: {
          _id: string;
        };
        get: {
          _id?: (0 | 1);
          title?: (0 | 1);
          description?: (0 | 1);
          location?: (0 | 1);
          address?: (0 | 1);
          status?: (0 | 1);
          priority?: (0 | 1);
          selected_language?: (0 | 1);
          crime_occurred_at?: (0 | 1);
          createdAt?: (0 | 1);
          updatedAt?: (0 | 1);
          reporter?: {
            _id?: (0 | 1);
            first_name?: (0 | 1);
            last_name?: (0 | 1);
            gender?: (0 | 1);
            address?: (0 | 1);
            level?: (0 | 1);
            email?: (0 | 1);
            is_verified?: (0 | 1);
            avatar?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            national_card?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            province?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            city?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            uploadedAssets?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            reports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
            blogPosts?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              slug?: (0 | 1);
              content?: (0 | 1);
              isPublished?: (0 | 1);
              isFeatured?: (0 | 1);
              publishedAt?: (0 | 1);
            };
          };
          documents?: {
            _id?: (0 | 1);
            title?: (0 | 1);
            description?: (0 | 1);
            selected_language?: (0 | 1);
            documentFiles?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            report?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
          };
          tags?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            color?: (0 | 1);
            icon?: (0 | 1);
            registrar?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            reports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
            blogPosts?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              slug?: (0 | 1);
              content?: (0 | 1);
              isPublished?: (0 | 1);
              isFeatured?: (0 | 1);
              publishedAt?: (0 | 1);
            };
          };
          category?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            color?: (0 | 1);
            icon?: (0 | 1);
            registrar?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            reports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
          };
          hostileCountries?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
            international_response?: (0 | 1);
            war_crimes_documentation?: (0 | 1);
            human_rights_violations?: (0 | 1);
            genocide_info?: (0 | 1);
            chemical_weapons_info?: (0 | 1);
            displacement_info?: (0 | 1);
            reconstruction_status?: (0 | 1);
            international_sanctions?: (0 | 1);
            notable_war_events?: (0 | 1);
            registrar?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            provinces?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              createdAt?: (0 | 1);
              updatedAt?: (0 | 1);
              wars_history?: (0 | 1);
              conflict_timeline?: (0 | 1);
              casualties_info?: (0 | 1);
              notable_battles?: (0 | 1);
              occupation_info?: (0 | 1);
              destruction_level?: (0 | 1);
              civilian_impact?: (0 | 1);
              mass_graves_info?: (0 | 1);
              war_crimes_events?: (0 | 1);
              liberation_info?: (0 | 1);
            };
            hostileReports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
            attackedReports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
          };
          attackedCountries?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
            international_response?: (0 | 1);
            war_crimes_documentation?: (0 | 1);
            human_rights_violations?: (0 | 1);
            genocide_info?: (0 | 1);
            chemical_weapons_info?: (0 | 1);
            displacement_info?: (0 | 1);
            reconstruction_status?: (0 | 1);
            international_sanctions?: (0 | 1);
            notable_war_events?: (0 | 1);
            registrar?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            provinces?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              createdAt?: (0 | 1);
              updatedAt?: (0 | 1);
              wars_history?: (0 | 1);
              conflict_timeline?: (0 | 1);
              casualties_info?: (0 | 1);
              notable_battles?: (0 | 1);
              occupation_info?: (0 | 1);
              destruction_level?: (0 | 1);
              civilian_impact?: (0 | 1);
              mass_graves_info?: (0 | 1);
              war_crimes_events?: (0 | 1);
              liberation_info?: (0 | 1);
            };
            hostileReports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
            attackedReports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
          };
          attackedProvinces?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
            registrar?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            country?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              createdAt?: (0 | 1);
              updatedAt?: (0 | 1);
              wars_history?: (0 | 1);
              conflict_timeline?: (0 | 1);
              casualties_info?: (0 | 1);
              international_response?: (0 | 1);
              war_crimes_documentation?: (0 | 1);
              human_rights_violations?: (0 | 1);
              genocide_info?: (0 | 1);
              chemical_weapons_info?: (0 | 1);
              displacement_info?: (0 | 1);
              reconstruction_status?: (0 | 1);
              international_sanctions?: (0 | 1);
              notable_war_events?: (0 | 1);
            };
            users?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            cities?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              createdAt?: (0 | 1);
              updatedAt?: (0 | 1);
              wars_history?: (0 | 1);
              conflict_timeline?: (0 | 1);
              casualties_info?: (0 | 1);
              notable_battles?: (0 | 1);
              occupation_info?: (0 | 1);
              destruction_level?: (0 | 1);
              civilian_impact?: (0 | 1);
              mass_graves_info?: (0 | 1);
              war_crimes_events?: (0 | 1);
              liberation_info?: (0 | 1);
            };
            capital?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              createdAt?: (0 | 1);
              updatedAt?: (0 | 1);
              wars_history?: (0 | 1);
              conflict_timeline?: (0 | 1);
              casualties_info?: (0 | 1);
              notable_battles?: (0 | 1);
              occupation_info?: (0 | 1);
              destruction_level?: (0 | 1);
              civilian_impact?: (0 | 1);
              mass_graves_info?: (0 | 1);
              war_crimes_events?: (0 | 1);
              liberation_info?: (0 | 1);
            };
            attackedByReports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
          };
          attackedCities?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
            registrar?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            province?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              createdAt?: (0 | 1);
              updatedAt?: (0 | 1);
              wars_history?: (0 | 1);
              conflict_timeline?: (0 | 1);
              casualties_info?: (0 | 1);
              notable_battles?: (0 | 1);
              occupation_info?: (0 | 1);
              destruction_level?: (0 | 1);
              civilian_impact?: (0 | 1);
              mass_graves_info?: (0 | 1);
              war_crimes_events?: (0 | 1);
              liberation_info?: (0 | 1);
            };
            users?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            attackedByReports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
          };
        };
      };


      gets: {
        set: {
          page?: number;
          limit?: number;
          skip?: number;
          search?: string;
          status?: ("Pending" | "Approved" | "Rejected" | "InReview");
          priority?: ("Low" | "Medium" | "High");
          selected_language?: ("en" | "zh" | "hi" | "es" | "fr" | "ar" | "pt" | "ru" | "ja" | "pa" | "de" | "id" | "te" | "mr" | "tr" | "ta" | "vi" | "ko" | "it" | "fa" | "nl" | "sv" | "pl" | "uk" | "ro");
          categoryIds?: string[];
          tagIds?: string[];
          userIds?: string[];
          hostileCountryIds?: string[];
          attackedCountryIds?: string[];
          attackedProvinceIds?: string[];
          attackedCityIds?: string[];
          createdAtFrom?: Date;
          createdAtTo?: Date;
          crimeOccurredFrom?: Date;
          crimeOccurredTo?: Date;
          nearLng?: number;
          nearLat?: number;
          maxDistance?: number;
          bbox?: number[];
          sortBy?: ("createdAt" | "updatedAt" | "title" | "status" | "priority" | "crime_occurred_at");
          sortOrder?: ("asc" | "desc");
        };
        get: {
          _id?: (0 | 1);
          title?: (0 | 1);
          description?: (0 | 1);
          location?: (0 | 1);
          address?: (0 | 1);
          status?: (0 | 1);
          priority?: (0 | 1);
          selected_language?: (0 | 1);
          crime_occurred_at?: (0 | 1);
          createdAt?: (0 | 1);
          updatedAt?: (0 | 1);
          reporter?: {
            _id?: (0 | 1);
            first_name?: (0 | 1);
            last_name?: (0 | 1);
            gender?: (0 | 1);
            address?: (0 | 1);
            level?: (0 | 1);
            email?: (0 | 1);
            is_verified?: (0 | 1);
            avatar?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            national_card?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            province?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            city?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            uploadedAssets?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            reports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
            blogPosts?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              slug?: (0 | 1);
              content?: (0 | 1);
              isPublished?: (0 | 1);
              isFeatured?: (0 | 1);
              publishedAt?: (0 | 1);
            };
          };
          documents?: {
            _id?: (0 | 1);
            title?: (0 | 1);
            description?: (0 | 1);
            selected_language?: (0 | 1);
            documentFiles?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            report?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
          };
          tags?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            color?: (0 | 1);
            icon?: (0 | 1);
            registrar?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            reports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
            blogPosts?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              slug?: (0 | 1);
              content?: (0 | 1);
              isPublished?: (0 | 1);
              isFeatured?: (0 | 1);
              publishedAt?: (0 | 1);
            };
          };
          category?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            color?: (0 | 1);
            icon?: (0 | 1);
            registrar?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            reports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
          };
          hostileCountries?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
            international_response?: (0 | 1);
            war_crimes_documentation?: (0 | 1);
            human_rights_violations?: (0 | 1);
            genocide_info?: (0 | 1);
            chemical_weapons_info?: (0 | 1);
            displacement_info?: (0 | 1);
            reconstruction_status?: (0 | 1);
            international_sanctions?: (0 | 1);
            notable_war_events?: (0 | 1);
            registrar?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            provinces?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              createdAt?: (0 | 1);
              updatedAt?: (0 | 1);
              wars_history?: (0 | 1);
              conflict_timeline?: (0 | 1);
              casualties_info?: (0 | 1);
              notable_battles?: (0 | 1);
              occupation_info?: (0 | 1);
              destruction_level?: (0 | 1);
              civilian_impact?: (0 | 1);
              mass_graves_info?: (0 | 1);
              war_crimes_events?: (0 | 1);
              liberation_info?: (0 | 1);
            };
            hostileReports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
            attackedReports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
          };
          attackedCountries?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
            international_response?: (0 | 1);
            war_crimes_documentation?: (0 | 1);
            human_rights_violations?: (0 | 1);
            genocide_info?: (0 | 1);
            chemical_weapons_info?: (0 | 1);
            displacement_info?: (0 | 1);
            reconstruction_status?: (0 | 1);
            international_sanctions?: (0 | 1);
            notable_war_events?: (0 | 1);
            registrar?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            provinces?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              createdAt?: (0 | 1);
              updatedAt?: (0 | 1);
              wars_history?: (0 | 1);
              conflict_timeline?: (0 | 1);
              casualties_info?: (0 | 1);
              notable_battles?: (0 | 1);
              occupation_info?: (0 | 1);
              destruction_level?: (0 | 1);
              civilian_impact?: (0 | 1);
              mass_graves_info?: (0 | 1);
              war_crimes_events?: (0 | 1);
              liberation_info?: (0 | 1);
            };
            hostileReports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
            attackedReports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
          };
          attackedProvinces?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
            registrar?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            country?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              createdAt?: (0 | 1);
              updatedAt?: (0 | 1);
              wars_history?: (0 | 1);
              conflict_timeline?: (0 | 1);
              casualties_info?: (0 | 1);
              international_response?: (0 | 1);
              war_crimes_documentation?: (0 | 1);
              human_rights_violations?: (0 | 1);
              genocide_info?: (0 | 1);
              chemical_weapons_info?: (0 | 1);
              displacement_info?: (0 | 1);
              reconstruction_status?: (0 | 1);
              international_sanctions?: (0 | 1);
              notable_war_events?: (0 | 1);
            };
            users?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            cities?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              createdAt?: (0 | 1);
              updatedAt?: (0 | 1);
              wars_history?: (0 | 1);
              conflict_timeline?: (0 | 1);
              casualties_info?: (0 | 1);
              notable_battles?: (0 | 1);
              occupation_info?: (0 | 1);
              destruction_level?: (0 | 1);
              civilian_impact?: (0 | 1);
              mass_graves_info?: (0 | 1);
              war_crimes_events?: (0 | 1);
              liberation_info?: (0 | 1);
            };
            capital?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              createdAt?: (0 | 1);
              updatedAt?: (0 | 1);
              wars_history?: (0 | 1);
              conflict_timeline?: (0 | 1);
              casualties_info?: (0 | 1);
              notable_battles?: (0 | 1);
              occupation_info?: (0 | 1);
              destruction_level?: (0 | 1);
              civilian_impact?: (0 | 1);
              mass_graves_info?: (0 | 1);
              war_crimes_events?: (0 | 1);
              liberation_info?: (0 | 1);
            };
            attackedByReports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
          };
          attackedCities?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
            registrar?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            province?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              createdAt?: (0 | 1);
              updatedAt?: (0 | 1);
              wars_history?: (0 | 1);
              conflict_timeline?: (0 | 1);
              casualties_info?: (0 | 1);
              notable_battles?: (0 | 1);
              occupation_info?: (0 | 1);
              destruction_level?: (0 | 1);
              civilian_impact?: (0 | 1);
              mass_graves_info?: (0 | 1);
              war_crimes_events?: (0 | 1);
              liberation_info?: (0 | 1);
            };
            users?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            attackedByReports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
          };
        };
      };


      update: {
        set: {
          _id: string;
          title?: string;
          description?: string;
          location?: {
            type: "Point";
            coordinates: any[];
          };
          address?: string;
          status?: ("Pending" | "Approved" | "Rejected" | "InReview");
          priority?: ("Low" | "Medium" | "High");
          selected_language?: ("en" | "zh" | "hi" | "es" | "fr" | "ar" | "pt" | "ru" | "ja" | "pa" | "de" | "id" | "te" | "mr" | "tr" | "ta" | "vi" | "ko" | "it" | "fa" | "nl" | "sv" | "pl" | "uk" | "ro");
          crime_occurred_at?: Date;
        };
        get: {
          _id?: (0 | 1);
          title?: (0 | 1);
          description?: (0 | 1);
          location?: (0 | 1);
          address?: (0 | 1);
          status?: (0 | 1);
          priority?: (0 | 1);
          selected_language?: (0 | 1);
          crime_occurred_at?: (0 | 1);
          createdAt?: (0 | 1);
          updatedAt?: (0 | 1);
          reporter?: {
            _id?: (0 | 1);
            first_name?: (0 | 1);
            last_name?: (0 | 1);
            gender?: (0 | 1);
            address?: (0 | 1);
            level?: (0 | 1);
            email?: (0 | 1);
            is_verified?: (0 | 1);
            avatar?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            national_card?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            province?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            city?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            uploadedAssets?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            reports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
            blogPosts?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              slug?: (0 | 1);
              content?: (0 | 1);
              isPublished?: (0 | 1);
              isFeatured?: (0 | 1);
              publishedAt?: (0 | 1);
            };
          };
          documents?: {
            _id?: (0 | 1);
            title?: (0 | 1);
            description?: (0 | 1);
            selected_language?: (0 | 1);
            documentFiles?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            report?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
          };
          tags?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            color?: (0 | 1);
            icon?: (0 | 1);
            registrar?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            reports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
            blogPosts?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              slug?: (0 | 1);
              content?: (0 | 1);
              isPublished?: (0 | 1);
              isFeatured?: (0 | 1);
              publishedAt?: (0 | 1);
            };
          };
          category?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            color?: (0 | 1);
            icon?: (0 | 1);
            registrar?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            reports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
          };
          hostileCountries?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
            international_response?: (0 | 1);
            war_crimes_documentation?: (0 | 1);
            human_rights_violations?: (0 | 1);
            genocide_info?: (0 | 1);
            chemical_weapons_info?: (0 | 1);
            displacement_info?: (0 | 1);
            reconstruction_status?: (0 | 1);
            international_sanctions?: (0 | 1);
            notable_war_events?: (0 | 1);
            registrar?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            provinces?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              createdAt?: (0 | 1);
              updatedAt?: (0 | 1);
              wars_history?: (0 | 1);
              conflict_timeline?: (0 | 1);
              casualties_info?: (0 | 1);
              notable_battles?: (0 | 1);
              occupation_info?: (0 | 1);
              destruction_level?: (0 | 1);
              civilian_impact?: (0 | 1);
              mass_graves_info?: (0 | 1);
              war_crimes_events?: (0 | 1);
              liberation_info?: (0 | 1);
            };
            hostileReports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
            attackedReports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
          };
          attackedCountries?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
            international_response?: (0 | 1);
            war_crimes_documentation?: (0 | 1);
            human_rights_violations?: (0 | 1);
            genocide_info?: (0 | 1);
            chemical_weapons_info?: (0 | 1);
            displacement_info?: (0 | 1);
            reconstruction_status?: (0 | 1);
            international_sanctions?: (0 | 1);
            notable_war_events?: (0 | 1);
            registrar?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            provinces?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              createdAt?: (0 | 1);
              updatedAt?: (0 | 1);
              wars_history?: (0 | 1);
              conflict_timeline?: (0 | 1);
              casualties_info?: (0 | 1);
              notable_battles?: (0 | 1);
              occupation_info?: (0 | 1);
              destruction_level?: (0 | 1);
              civilian_impact?: (0 | 1);
              mass_graves_info?: (0 | 1);
              war_crimes_events?: (0 | 1);
              liberation_info?: (0 | 1);
            };
            hostileReports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
            attackedReports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
          };
          attackedProvinces?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
            registrar?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            country?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              createdAt?: (0 | 1);
              updatedAt?: (0 | 1);
              wars_history?: (0 | 1);
              conflict_timeline?: (0 | 1);
              casualties_info?: (0 | 1);
              international_response?: (0 | 1);
              war_crimes_documentation?: (0 | 1);
              human_rights_violations?: (0 | 1);
              genocide_info?: (0 | 1);
              chemical_weapons_info?: (0 | 1);
              displacement_info?: (0 | 1);
              reconstruction_status?: (0 | 1);
              international_sanctions?: (0 | 1);
              notable_war_events?: (0 | 1);
            };
            users?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            cities?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              createdAt?: (0 | 1);
              updatedAt?: (0 | 1);
              wars_history?: (0 | 1);
              conflict_timeline?: (0 | 1);
              casualties_info?: (0 | 1);
              notable_battles?: (0 | 1);
              occupation_info?: (0 | 1);
              destruction_level?: (0 | 1);
              civilian_impact?: (0 | 1);
              mass_graves_info?: (0 | 1);
              war_crimes_events?: (0 | 1);
              liberation_info?: (0 | 1);
            };
            capital?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              createdAt?: (0 | 1);
              updatedAt?: (0 | 1);
              wars_history?: (0 | 1);
              conflict_timeline?: (0 | 1);
              casualties_info?: (0 | 1);
              notable_battles?: (0 | 1);
              occupation_info?: (0 | 1);
              destruction_level?: (0 | 1);
              civilian_impact?: (0 | 1);
              mass_graves_info?: (0 | 1);
              war_crimes_events?: (0 | 1);
              liberation_info?: (0 | 1);
            };
            attackedByReports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
          };
          attackedCities?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
            registrar?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            province?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              createdAt?: (0 | 1);
              updatedAt?: (0 | 1);
              wars_history?: (0 | 1);
              conflict_timeline?: (0 | 1);
              casualties_info?: (0 | 1);
              notable_battles?: (0 | 1);
              occupation_info?: (0 | 1);
              destruction_level?: (0 | 1);
              civilian_impact?: (0 | 1);
              mass_graves_info?: (0 | 1);
              war_crimes_events?: (0 | 1);
              liberation_info?: (0 | 1);
            };
            users?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            attackedByReports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
          };
        };
      };


      updateRelations: {
        set: {
          _id: string;
          tags?: string[];
          category?: string;
          documentIds?: string[];
          documentIdsToRemove?: string[];
          hostileCountryIds?: string[];
          hostileCountryIdsToRemove?: string[];
          attackedCountryIds?: string[];
          attackedCountryIdsToRemove?: string[];
          attackedProvinceIds?: string[];
          attackedProvinceIdsToRemove?: string[];
          attackedCityIds?: string[];
          attackedCityIdsToRemove?: string[];
        };
        get: {
          _id?: (0 | 1);
          title?: (0 | 1);
          description?: (0 | 1);
          location?: (0 | 1);
          address?: (0 | 1);
          status?: (0 | 1);
          priority?: (0 | 1);
          selected_language?: (0 | 1);
          crime_occurred_at?: (0 | 1);
          createdAt?: (0 | 1);
          updatedAt?: (0 | 1);
          reporter?: {
            _id?: (0 | 1);
            first_name?: (0 | 1);
            last_name?: (0 | 1);
            gender?: (0 | 1);
            address?: (0 | 1);
            level?: (0 | 1);
            email?: (0 | 1);
            is_verified?: (0 | 1);
            avatar?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            national_card?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            province?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            city?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            uploadedAssets?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            reports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
            blogPosts?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              slug?: (0 | 1);
              content?: (0 | 1);
              isPublished?: (0 | 1);
              isFeatured?: (0 | 1);
              publishedAt?: (0 | 1);
            };
          };
          documents?: {
            _id?: (0 | 1);
            title?: (0 | 1);
            description?: (0 | 1);
            selected_language?: (0 | 1);
            documentFiles?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            report?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
          };
          tags?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            color?: (0 | 1);
            icon?: (0 | 1);
            registrar?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            reports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
            blogPosts?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              slug?: (0 | 1);
              content?: (0 | 1);
              isPublished?: (0 | 1);
              isFeatured?: (0 | 1);
              publishedAt?: (0 | 1);
            };
          };
          category?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            color?: (0 | 1);
            icon?: (0 | 1);
            registrar?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            reports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
          };
          hostileCountries?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
            international_response?: (0 | 1);
            war_crimes_documentation?: (0 | 1);
            human_rights_violations?: (0 | 1);
            genocide_info?: (0 | 1);
            chemical_weapons_info?: (0 | 1);
            displacement_info?: (0 | 1);
            reconstruction_status?: (0 | 1);
            international_sanctions?: (0 | 1);
            notable_war_events?: (0 | 1);
            registrar?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            provinces?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              createdAt?: (0 | 1);
              updatedAt?: (0 | 1);
              wars_history?: (0 | 1);
              conflict_timeline?: (0 | 1);
              casualties_info?: (0 | 1);
              notable_battles?: (0 | 1);
              occupation_info?: (0 | 1);
              destruction_level?: (0 | 1);
              civilian_impact?: (0 | 1);
              mass_graves_info?: (0 | 1);
              war_crimes_events?: (0 | 1);
              liberation_info?: (0 | 1);
            };
            hostileReports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
            attackedReports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
          };
          attackedCountries?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
            international_response?: (0 | 1);
            war_crimes_documentation?: (0 | 1);
            human_rights_violations?: (0 | 1);
            genocide_info?: (0 | 1);
            chemical_weapons_info?: (0 | 1);
            displacement_info?: (0 | 1);
            reconstruction_status?: (0 | 1);
            international_sanctions?: (0 | 1);
            notable_war_events?: (0 | 1);
            registrar?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            provinces?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              createdAt?: (0 | 1);
              updatedAt?: (0 | 1);
              wars_history?: (0 | 1);
              conflict_timeline?: (0 | 1);
              casualties_info?: (0 | 1);
              notable_battles?: (0 | 1);
              occupation_info?: (0 | 1);
              destruction_level?: (0 | 1);
              civilian_impact?: (0 | 1);
              mass_graves_info?: (0 | 1);
              war_crimes_events?: (0 | 1);
              liberation_info?: (0 | 1);
            };
            hostileReports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
            attackedReports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
          };
          attackedProvinces?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
            registrar?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            country?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              createdAt?: (0 | 1);
              updatedAt?: (0 | 1);
              wars_history?: (0 | 1);
              conflict_timeline?: (0 | 1);
              casualties_info?: (0 | 1);
              international_response?: (0 | 1);
              war_crimes_documentation?: (0 | 1);
              human_rights_violations?: (0 | 1);
              genocide_info?: (0 | 1);
              chemical_weapons_info?: (0 | 1);
              displacement_info?: (0 | 1);
              reconstruction_status?: (0 | 1);
              international_sanctions?: (0 | 1);
              notable_war_events?: (0 | 1);
            };
            users?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            cities?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              createdAt?: (0 | 1);
              updatedAt?: (0 | 1);
              wars_history?: (0 | 1);
              conflict_timeline?: (0 | 1);
              casualties_info?: (0 | 1);
              notable_battles?: (0 | 1);
              occupation_info?: (0 | 1);
              destruction_level?: (0 | 1);
              civilian_impact?: (0 | 1);
              mass_graves_info?: (0 | 1);
              war_crimes_events?: (0 | 1);
              liberation_info?: (0 | 1);
            };
            capital?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              createdAt?: (0 | 1);
              updatedAt?: (0 | 1);
              wars_history?: (0 | 1);
              conflict_timeline?: (0 | 1);
              casualties_info?: (0 | 1);
              notable_battles?: (0 | 1);
              occupation_info?: (0 | 1);
              destruction_level?: (0 | 1);
              civilian_impact?: (0 | 1);
              mass_graves_info?: (0 | 1);
              war_crimes_events?: (0 | 1);
              liberation_info?: (0 | 1);
            };
            attackedByReports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
          };
          attackedCities?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
            registrar?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            province?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              createdAt?: (0 | 1);
              updatedAt?: (0 | 1);
              wars_history?: (0 | 1);
              conflict_timeline?: (0 | 1);
              casualties_info?: (0 | 1);
              notable_battles?: (0 | 1);
              occupation_info?: (0 | 1);
              destruction_level?: (0 | 1);
              civilian_impact?: (0 | 1);
              mass_graves_info?: (0 | 1);
              war_crimes_events?: (0 | 1);
              liberation_info?: (0 | 1);
            };
            users?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            attackedByReports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
          };
        };
      };


      remove: {
        set: {
          _id: string;
          hardCascade?: boolean;
        };
        get: {
          _id?: (0 | 1);
          title?: (0 | 1);
          description?: (0 | 1);
          location?: (0 | 1);
          address?: (0 | 1);
          status?: (0 | 1);
          priority?: (0 | 1);
          selected_language?: (0 | 1);
          crime_occurred_at?: (0 | 1);
          createdAt?: (0 | 1);
          updatedAt?: (0 | 1);
          reporter?: {
            _id?: (0 | 1);
            first_name?: (0 | 1);
            last_name?: (0 | 1);
            gender?: (0 | 1);
            address?: (0 | 1);
            level?: (0 | 1);
            email?: (0 | 1);
            is_verified?: (0 | 1);
          };
          documents?: {
            _id?: (0 | 1);
            title?: (0 | 1);
            description?: (0 | 1);
            selected_language?: (0 | 1);
          };
          tags?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            color?: (0 | 1);
            icon?: (0 | 1);
          };
          category?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            color?: (0 | 1);
            icon?: (0 | 1);
          };
          hostileCountries?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
            international_response?: (0 | 1);
            war_crimes_documentation?: (0 | 1);
            human_rights_violations?: (0 | 1);
            genocide_info?: (0 | 1);
            chemical_weapons_info?: (0 | 1);
            displacement_info?: (0 | 1);
            reconstruction_status?: (0 | 1);
            international_sanctions?: (0 | 1);
            notable_war_events?: (0 | 1);
          };
          attackedCountries?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
            international_response?: (0 | 1);
            war_crimes_documentation?: (0 | 1);
            human_rights_violations?: (0 | 1);
            genocide_info?: (0 | 1);
            chemical_weapons_info?: (0 | 1);
            displacement_info?: (0 | 1);
            reconstruction_status?: (0 | 1);
            international_sanctions?: (0 | 1);
            notable_war_events?: (0 | 1);
          };
          attackedProvinces?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
          };
          attackedCities?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
          };
        };
      };


      count: {
        set: {
          status?: ("Pending" | "Approved" | "Rejected" | "InReview");
          priority?: ("Low" | "Medium" | "High");
          selected_language?: ("en" | "zh" | "hi" | "es" | "fr" | "ar" | "pt" | "ru" | "ja" | "pa" | "de" | "id" | "te" | "mr" | "tr" | "ta" | "vi" | "ko" | "it" | "fa" | "nl" | "sv" | "pl" | "uk" | "ro");
          categoryId?: string;
          hostileCountryIds?: string[];
          attackedCountryIds?: string[];
          attackedProvinceIds?: string[];
          attackedCityIds?: string[];
          createdAtFrom?: Date;
          createdAtTo?: Date;
        };
        get: {
          qty?: (0 | 1);
        };
      };


      statistics: {
        set: {
          status?: ("Pending" | "Approved" | "Rejected" | "InReview");
          priority?: ("Low" | "Medium" | "High");
          selected_language?: ("en" | "zh" | "hi" | "es" | "fr" | "ar" | "pt" | "ru" | "ja" | "pa" | "de" | "id" | "te" | "mr" | "tr" | "ta" | "vi" | "ko" | "it" | "fa" | "nl" | "sv" | "pl" | "uk" | "ro");
          categoryId?: string;
          hostileCountryIds?: string[];
          attackedCountryIds?: string[];
          attackedProvinceIds?: string[];
          attackedCityIds?: string[];
          createdAtFrom?: Date;
          createdAtTo?: Date;
          crimeOccurredFrom?: Date;
          crimeOccurredTo?: Date;
        };
        get: {
          _id?: (0 | 1);
          title?: (0 | 1);
          description?: (0 | 1);
          location?: (0 | 1);
          address?: (0 | 1);
          status?: (0 | 1);
          priority?: (0 | 1);
          selected_language?: (0 | 1);
          crime_occurred_at?: (0 | 1);
          createdAt?: (0 | 1);
          updatedAt?: (0 | 1);
          reporter?: {
            _id?: (0 | 1);
            first_name?: (0 | 1);
            last_name?: (0 | 1);
            gender?: (0 | 1);
            address?: (0 | 1);
            level?: (0 | 1);
            email?: (0 | 1);
            is_verified?: (0 | 1);
          };
          documents?: {
            _id?: (0 | 1);
            title?: (0 | 1);
            description?: (0 | 1);
            selected_language?: (0 | 1);
          };
          tags?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            color?: (0 | 1);
            icon?: (0 | 1);
          };
          category?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            color?: (0 | 1);
            icon?: (0 | 1);
          };
          hostileCountries?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
            international_response?: (0 | 1);
            war_crimes_documentation?: (0 | 1);
            human_rights_violations?: (0 | 1);
            genocide_info?: (0 | 1);
            chemical_weapons_info?: (0 | 1);
            displacement_info?: (0 | 1);
            reconstruction_status?: (0 | 1);
            international_sanctions?: (0 | 1);
            notable_war_events?: (0 | 1);
          };
          attackedCountries?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
            international_response?: (0 | 1);
            war_crimes_documentation?: (0 | 1);
            human_rights_violations?: (0 | 1);
            genocide_info?: (0 | 1);
            chemical_weapons_info?: (0 | 1);
            displacement_info?: (0 | 1);
            reconstruction_status?: (0 | 1);
            international_sanctions?: (0 | 1);
            notable_war_events?: (0 | 1);
          };
          attackedProvinces?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
          };
          attackedCities?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
          };
        };
      };


      exportCSV: {
        set: {
          search?: string;
          status?: ("Pending" | "Approved" | "Rejected" | "InReview");
          priority?: ("Low" | "Medium" | "High");
          selected_language?: ("en" | "zh" | "hi" | "es" | "fr" | "ar" | "pt" | "ru" | "ja" | "pa" | "de" | "id" | "te" | "mr" | "tr" | "ta" | "vi" | "ko" | "it" | "fa" | "nl" | "sv" | "pl" | "uk" | "ro");
          categoryIds?: string[];
          tagIds?: string[];
          userIds?: string[];
          hostileCountryIds?: string[];
          attackedCountryIds?: string[];
          attackedProvinceIds?: string[];
          attackedCityIds?: string[];
          createdAtFrom?: Date;
          createdAtTo?: Date;
          crimeOccurredFrom?: Date;
          crimeOccurredTo?: Date;
          nearLng?: number;
          nearLat?: number;
          maxDistance?: number;
          bbox?: number[];
          sortBy?: ("createdAt" | "updatedAt" | "title" | "status" | "priority" | "crime_occurred_at");
          sortOrder?: ("asc" | "desc");
          limit?: number;
        };
        get: {
          _id?: (0 | 1);
          title?: (0 | 1);
          description?: (0 | 1);
          location?: (0 | 1);
          address?: (0 | 1);
          status?: (0 | 1);
          priority?: (0 | 1);
          selected_language?: (0 | 1);
          crime_occurred_at?: (0 | 1);
          createdAt?: (0 | 1);
          updatedAt?: (0 | 1);
          reporter?: {
            _id?: (0 | 1);
            first_name?: (0 | 1);
            last_name?: (0 | 1);
            gender?: (0 | 1);
            address?: (0 | 1);
            level?: (0 | 1);
            email?: (0 | 1);
            is_verified?: (0 | 1);
            avatar?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            national_card?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            province?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            city?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            uploadedAssets?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            reports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
            blogPosts?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              slug?: (0 | 1);
              content?: (0 | 1);
              isPublished?: (0 | 1);
              isFeatured?: (0 | 1);
              publishedAt?: (0 | 1);
            };
          };
          documents?: {
            _id?: (0 | 1);
            title?: (0 | 1);
            description?: (0 | 1);
            selected_language?: (0 | 1);
            documentFiles?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            report?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
          };
          tags?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            color?: (0 | 1);
            icon?: (0 | 1);
            registrar?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            reports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
            blogPosts?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              slug?: (0 | 1);
              content?: (0 | 1);
              isPublished?: (0 | 1);
              isFeatured?: (0 | 1);
              publishedAt?: (0 | 1);
            };
          };
          category?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            color?: (0 | 1);
            icon?: (0 | 1);
            registrar?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            reports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
          };
          hostileCountries?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
            international_response?: (0 | 1);
            war_crimes_documentation?: (0 | 1);
            human_rights_violations?: (0 | 1);
            genocide_info?: (0 | 1);
            chemical_weapons_info?: (0 | 1);
            displacement_info?: (0 | 1);
            reconstruction_status?: (0 | 1);
            international_sanctions?: (0 | 1);
            notable_war_events?: (0 | 1);
            registrar?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            provinces?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              createdAt?: (0 | 1);
              updatedAt?: (0 | 1);
              wars_history?: (0 | 1);
              conflict_timeline?: (0 | 1);
              casualties_info?: (0 | 1);
              notable_battles?: (0 | 1);
              occupation_info?: (0 | 1);
              destruction_level?: (0 | 1);
              civilian_impact?: (0 | 1);
              mass_graves_info?: (0 | 1);
              war_crimes_events?: (0 | 1);
              liberation_info?: (0 | 1);
            };
            hostileReports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
            attackedReports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
          };
          attackedCountries?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
            international_response?: (0 | 1);
            war_crimes_documentation?: (0 | 1);
            human_rights_violations?: (0 | 1);
            genocide_info?: (0 | 1);
            chemical_weapons_info?: (0 | 1);
            displacement_info?: (0 | 1);
            reconstruction_status?: (0 | 1);
            international_sanctions?: (0 | 1);
            notable_war_events?: (0 | 1);
            registrar?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            provinces?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              createdAt?: (0 | 1);
              updatedAt?: (0 | 1);
              wars_history?: (0 | 1);
              conflict_timeline?: (0 | 1);
              casualties_info?: (0 | 1);
              notable_battles?: (0 | 1);
              occupation_info?: (0 | 1);
              destruction_level?: (0 | 1);
              civilian_impact?: (0 | 1);
              mass_graves_info?: (0 | 1);
              war_crimes_events?: (0 | 1);
              liberation_info?: (0 | 1);
            };
            hostileReports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
            attackedReports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
          };
          attackedProvinces?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
            registrar?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            country?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              createdAt?: (0 | 1);
              updatedAt?: (0 | 1);
              wars_history?: (0 | 1);
              conflict_timeline?: (0 | 1);
              casualties_info?: (0 | 1);
              international_response?: (0 | 1);
              war_crimes_documentation?: (0 | 1);
              human_rights_violations?: (0 | 1);
              genocide_info?: (0 | 1);
              chemical_weapons_info?: (0 | 1);
              displacement_info?: (0 | 1);
              reconstruction_status?: (0 | 1);
              international_sanctions?: (0 | 1);
              notable_war_events?: (0 | 1);
            };
            users?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            cities?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              createdAt?: (0 | 1);
              updatedAt?: (0 | 1);
              wars_history?: (0 | 1);
              conflict_timeline?: (0 | 1);
              casualties_info?: (0 | 1);
              notable_battles?: (0 | 1);
              occupation_info?: (0 | 1);
              destruction_level?: (0 | 1);
              civilian_impact?: (0 | 1);
              mass_graves_info?: (0 | 1);
              war_crimes_events?: (0 | 1);
              liberation_info?: (0 | 1);
            };
            capital?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              createdAt?: (0 | 1);
              updatedAt?: (0 | 1);
              wars_history?: (0 | 1);
              conflict_timeline?: (0 | 1);
              casualties_info?: (0 | 1);
              notable_battles?: (0 | 1);
              occupation_info?: (0 | 1);
              destruction_level?: (0 | 1);
              civilian_impact?: (0 | 1);
              mass_graves_info?: (0 | 1);
              war_crimes_events?: (0 | 1);
              liberation_info?: (0 | 1);
            };
            attackedByReports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
          };
          attackedCities?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
            registrar?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            province?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              createdAt?: (0 | 1);
              updatedAt?: (0 | 1);
              wars_history?: (0 | 1);
              conflict_timeline?: (0 | 1);
              casualties_info?: (0 | 1);
              notable_battles?: (0 | 1);
              occupation_info?: (0 | 1);
              destruction_level?: (0 | 1);
              civilian_impact?: (0 | 1);
              mass_graves_info?: (0 | 1);
              war_crimes_events?: (0 | 1);
              liberation_info?: (0 | 1);
            };
            users?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            attackedByReports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
          };
        };
      };


      exportPDF: {
        set: {
          _id: string;
        };
        get: {
          _id?: (0 | 1);
          title?: (0 | 1);
          description?: (0 | 1);
          location?: (0 | 1);
          address?: (0 | 1);
          status?: (0 | 1);
          priority?: (0 | 1);
          selected_language?: (0 | 1);
          crime_occurred_at?: (0 | 1);
          createdAt?: (0 | 1);
          updatedAt?: (0 | 1);
          reporter?: {
            _id?: (0 | 1);
            first_name?: (0 | 1);
            last_name?: (0 | 1);
            gender?: (0 | 1);
            address?: (0 | 1);
            level?: (0 | 1);
            email?: (0 | 1);
            is_verified?: (0 | 1);
            avatar?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            national_card?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            province?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            city?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            uploadedAssets?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            reports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
            blogPosts?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              slug?: (0 | 1);
              content?: (0 | 1);
              isPublished?: (0 | 1);
              isFeatured?: (0 | 1);
              publishedAt?: (0 | 1);
            };
          };
          documents?: {
            _id?: (0 | 1);
            title?: (0 | 1);
            description?: (0 | 1);
            selected_language?: (0 | 1);
            documentFiles?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            report?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
          };
          tags?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            color?: (0 | 1);
            icon?: (0 | 1);
            registrar?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            reports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
            blogPosts?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              slug?: (0 | 1);
              content?: (0 | 1);
              isPublished?: (0 | 1);
              isFeatured?: (0 | 1);
              publishedAt?: (0 | 1);
            };
          };
          category?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            color?: (0 | 1);
            icon?: (0 | 1);
            registrar?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            reports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
          };
          hostileCountries?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
            international_response?: (0 | 1);
            war_crimes_documentation?: (0 | 1);
            human_rights_violations?: (0 | 1);
            genocide_info?: (0 | 1);
            chemical_weapons_info?: (0 | 1);
            displacement_info?: (0 | 1);
            reconstruction_status?: (0 | 1);
            international_sanctions?: (0 | 1);
            notable_war_events?: (0 | 1);
            registrar?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            provinces?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              createdAt?: (0 | 1);
              updatedAt?: (0 | 1);
              wars_history?: (0 | 1);
              conflict_timeline?: (0 | 1);
              casualties_info?: (0 | 1);
              notable_battles?: (0 | 1);
              occupation_info?: (0 | 1);
              destruction_level?: (0 | 1);
              civilian_impact?: (0 | 1);
              mass_graves_info?: (0 | 1);
              war_crimes_events?: (0 | 1);
              liberation_info?: (0 | 1);
            };
            hostileReports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
            attackedReports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
          };
          attackedCountries?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
            international_response?: (0 | 1);
            war_crimes_documentation?: (0 | 1);
            human_rights_violations?: (0 | 1);
            genocide_info?: (0 | 1);
            chemical_weapons_info?: (0 | 1);
            displacement_info?: (0 | 1);
            reconstruction_status?: (0 | 1);
            international_sanctions?: (0 | 1);
            notable_war_events?: (0 | 1);
            registrar?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            provinces?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              createdAt?: (0 | 1);
              updatedAt?: (0 | 1);
              wars_history?: (0 | 1);
              conflict_timeline?: (0 | 1);
              casualties_info?: (0 | 1);
              notable_battles?: (0 | 1);
              occupation_info?: (0 | 1);
              destruction_level?: (0 | 1);
              civilian_impact?: (0 | 1);
              mass_graves_info?: (0 | 1);
              war_crimes_events?: (0 | 1);
              liberation_info?: (0 | 1);
            };
            hostileReports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
            attackedReports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
          };
          attackedProvinces?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
            registrar?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            country?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              createdAt?: (0 | 1);
              updatedAt?: (0 | 1);
              wars_history?: (0 | 1);
              conflict_timeline?: (0 | 1);
              casualties_info?: (0 | 1);
              international_response?: (0 | 1);
              war_crimes_documentation?: (0 | 1);
              human_rights_violations?: (0 | 1);
              genocide_info?: (0 | 1);
              chemical_weapons_info?: (0 | 1);
              displacement_info?: (0 | 1);
              reconstruction_status?: (0 | 1);
              international_sanctions?: (0 | 1);
              notable_war_events?: (0 | 1);
            };
            users?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            cities?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              createdAt?: (0 | 1);
              updatedAt?: (0 | 1);
              wars_history?: (0 | 1);
              conflict_timeline?: (0 | 1);
              casualties_info?: (0 | 1);
              notable_battles?: (0 | 1);
              occupation_info?: (0 | 1);
              destruction_level?: (0 | 1);
              civilian_impact?: (0 | 1);
              mass_graves_info?: (0 | 1);
              war_crimes_events?: (0 | 1);
              liberation_info?: (0 | 1);
            };
            capital?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              createdAt?: (0 | 1);
              updatedAt?: (0 | 1);
              wars_history?: (0 | 1);
              conflict_timeline?: (0 | 1);
              casualties_info?: (0 | 1);
              notable_battles?: (0 | 1);
              occupation_info?: (0 | 1);
              destruction_level?: (0 | 1);
              civilian_impact?: (0 | 1);
              mass_graves_info?: (0 | 1);
              war_crimes_events?: (0 | 1);
              liberation_info?: (0 | 1);
            };
            attackedByReports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
          };
          attackedCities?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            english_name?: (0 | 1);
            registrar?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            province?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              createdAt?: (0 | 1);
              updatedAt?: (0 | 1);
              wars_history?: (0 | 1);
              conflict_timeline?: (0 | 1);
              casualties_info?: (0 | 1);
              notable_battles?: (0 | 1);
              occupation_info?: (0 | 1);
              destruction_level?: (0 | 1);
              civilian_impact?: (0 | 1);
              mass_graves_info?: (0 | 1);
              war_crimes_events?: (0 | 1);
              liberation_info?: (0 | 1);
            };
            users?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            attackedByReports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
          };
        };
      };


    }


    document: {


      add: {
        set: {
          title: string;
          description?: string;
          selected_language?: ("en" | "zh" | "hi" | "es" | "fr" | "ar" | "pt" | "ru" | "ja" | "pa" | "de" | "id" | "te" | "mr" | "tr" | "ta" | "vi" | "ko" | "it" | "fa" | "nl" | "sv" | "pl" | "uk" | "ro");
          createdAt?: Date;
          updatedAt?: Date;
          documentFileIds?: string[];
        };
        get: {
          _id?: (0 | 1);
          title?: (0 | 1);
          description?: (0 | 1);
          selected_language?: (0 | 1);
          createdAt?: (0 | 1);
          updatedAt?: (0 | 1);
          documentFiles?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            mimeType?: (0 | 1);
            type?: (0 | 1);
            alt_text?: (0 | 1);
          };
          report?: {
            _id?: (0 | 1);
            title?: (0 | 1);
            description?: (0 | 1);
            location?: (0 | 1);
            address?: (0 | 1);
            status?: (0 | 1);
            priority?: (0 | 1);
            selected_language?: (0 | 1);
            crime_occurred_at?: (0 | 1);
          };
        };
      };


      get: {
        set: {
          _id: string;
        };
        get: {
          _id?: (0 | 1);
          title?: (0 | 1);
          description?: (0 | 1);
          selected_language?: (0 | 1);
          createdAt?: (0 | 1);
          updatedAt?: (0 | 1);
          documentFiles?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            mimeType?: (0 | 1);
            type?: (0 | 1);
            alt_text?: (0 | 1);
            uploader?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
          };
          report?: {
            _id?: (0 | 1);
            title?: (0 | 1);
            description?: (0 | 1);
            location?: (0 | 1);
            address?: (0 | 1);
            status?: (0 | 1);
            priority?: (0 | 1);
            selected_language?: (0 | 1);
            crime_occurred_at?: (0 | 1);
            reporter?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            documents?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              selected_language?: (0 | 1);
            };
            tags?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              color?: (0 | 1);
              icon?: (0 | 1);
            };
            category?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              color?: (0 | 1);
              icon?: (0 | 1);
            };
            hostileCountries?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              international_response?: (0 | 1);
              war_crimes_documentation?: (0 | 1);
              human_rights_violations?: (0 | 1);
              genocide_info?: (0 | 1);
              chemical_weapons_info?: (0 | 1);
              displacement_info?: (0 | 1);
              reconstruction_status?: (0 | 1);
              international_sanctions?: (0 | 1);
              notable_war_events?: (0 | 1);
            };
            attackedCountries?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              international_response?: (0 | 1);
              war_crimes_documentation?: (0 | 1);
              human_rights_violations?: (0 | 1);
              genocide_info?: (0 | 1);
              chemical_weapons_info?: (0 | 1);
              displacement_info?: (0 | 1);
              reconstruction_status?: (0 | 1);
              international_sanctions?: (0 | 1);
              notable_war_events?: (0 | 1);
            };
            attackedProvinces?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            attackedCities?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
          };
        };
      };


      gets: {
        set: {
          page?: number;
          limit?: number;
          skip?: number;
          search?: string;
          reportId?: string;
          selected_language?: ("en" | "zh" | "hi" | "es" | "fr" | "ar" | "pt" | "ru" | "ja" | "pa" | "de" | "id" | "te" | "mr" | "tr" | "ta" | "vi" | "ko" | "it" | "fa" | "nl" | "sv" | "pl" | "uk" | "ro");
          documentTypes?: ("image" | "video" | "docs")[];
          sortBy?: ("createdAt" | "updatedAt" | "title");
          sortOrder?: ("asc" | "desc");
        };
        get: {
          _id?: (0 | 1);
          title?: (0 | 1);
          description?: (0 | 1);
          selected_language?: (0 | 1);
          createdAt?: (0 | 1);
          updatedAt?: (0 | 1);
          documentFiles?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            mimeType?: (0 | 1);
            type?: (0 | 1);
            alt_text?: (0 | 1);
            uploader?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
          };
          report?: {
            _id?: (0 | 1);
            title?: (0 | 1);
            description?: (0 | 1);
            location?: (0 | 1);
            address?: (0 | 1);
            status?: (0 | 1);
            priority?: (0 | 1);
            selected_language?: (0 | 1);
            crime_occurred_at?: (0 | 1);
            reporter?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            documents?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              selected_language?: (0 | 1);
            };
            tags?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              color?: (0 | 1);
              icon?: (0 | 1);
            };
            category?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              color?: (0 | 1);
              icon?: (0 | 1);
            };
            hostileCountries?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              international_response?: (0 | 1);
              war_crimes_documentation?: (0 | 1);
              human_rights_violations?: (0 | 1);
              genocide_info?: (0 | 1);
              chemical_weapons_info?: (0 | 1);
              displacement_info?: (0 | 1);
              reconstruction_status?: (0 | 1);
              international_sanctions?: (0 | 1);
              notable_war_events?: (0 | 1);
            };
            attackedCountries?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              international_response?: (0 | 1);
              war_crimes_documentation?: (0 | 1);
              human_rights_violations?: (0 | 1);
              genocide_info?: (0 | 1);
              chemical_weapons_info?: (0 | 1);
              displacement_info?: (0 | 1);
              reconstruction_status?: (0 | 1);
              international_sanctions?: (0 | 1);
              notable_war_events?: (0 | 1);
            };
            attackedProvinces?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            attackedCities?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
          };
        };
      };


      update: {
        set: {
          _id: string;
          title?: string;
          description?: string;
          selected_language?: ("en" | "zh" | "hi" | "es" | "fr" | "ar" | "pt" | "ru" | "ja" | "pa" | "de" | "id" | "te" | "mr" | "tr" | "ta" | "vi" | "ko" | "it" | "fa" | "nl" | "sv" | "pl" | "uk" | "ro");
        };
        get: {
          _id?: (0 | 1);
          title?: (0 | 1);
          description?: (0 | 1);
          selected_language?: (0 | 1);
          createdAt?: (0 | 1);
          updatedAt?: (0 | 1);
          documentFiles?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            mimeType?: (0 | 1);
            type?: (0 | 1);
            alt_text?: (0 | 1);
            uploader?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
          };
          report?: {
            _id?: (0 | 1);
            title?: (0 | 1);
            description?: (0 | 1);
            location?: (0 | 1);
            address?: (0 | 1);
            status?: (0 | 1);
            priority?: (0 | 1);
            selected_language?: (0 | 1);
            crime_occurred_at?: (0 | 1);
            reporter?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            documents?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              selected_language?: (0 | 1);
            };
            tags?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              color?: (0 | 1);
              icon?: (0 | 1);
            };
            category?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              color?: (0 | 1);
              icon?: (0 | 1);
            };
            hostileCountries?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              international_response?: (0 | 1);
              war_crimes_documentation?: (0 | 1);
              human_rights_violations?: (0 | 1);
              genocide_info?: (0 | 1);
              chemical_weapons_info?: (0 | 1);
              displacement_info?: (0 | 1);
              reconstruction_status?: (0 | 1);
              international_sanctions?: (0 | 1);
              notable_war_events?: (0 | 1);
            };
            attackedCountries?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              international_response?: (0 | 1);
              war_crimes_documentation?: (0 | 1);
              human_rights_violations?: (0 | 1);
              genocide_info?: (0 | 1);
              chemical_weapons_info?: (0 | 1);
              displacement_info?: (0 | 1);
              reconstruction_status?: (0 | 1);
              international_sanctions?: (0 | 1);
              notable_war_events?: (0 | 1);
            };
            attackedProvinces?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            attackedCities?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
          };
        };
      };


      updateRelations: {
        set: {
          _id: string;
          documentFileIds?: string[];
          documentFileIdsToRemove?: string[];
        };
        get: {
          _id?: (0 | 1);
          title?: (0 | 1);
          description?: (0 | 1);
          selected_language?: (0 | 1);
          createdAt?: (0 | 1);
          updatedAt?: (0 | 1);
          documentFiles?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            mimeType?: (0 | 1);
            type?: (0 | 1);
            alt_text?: (0 | 1);
            uploader?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
          };
          report?: {
            _id?: (0 | 1);
            title?: (0 | 1);
            description?: (0 | 1);
            location?: (0 | 1);
            address?: (0 | 1);
            status?: (0 | 1);
            priority?: (0 | 1);
            selected_language?: (0 | 1);
            crime_occurred_at?: (0 | 1);
            reporter?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            documents?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              selected_language?: (0 | 1);
            };
            tags?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              color?: (0 | 1);
              icon?: (0 | 1);
            };
            category?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              color?: (0 | 1);
              icon?: (0 | 1);
            };
            hostileCountries?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              international_response?: (0 | 1);
              war_crimes_documentation?: (0 | 1);
              human_rights_violations?: (0 | 1);
              genocide_info?: (0 | 1);
              chemical_weapons_info?: (0 | 1);
              displacement_info?: (0 | 1);
              reconstruction_status?: (0 | 1);
              international_sanctions?: (0 | 1);
              notable_war_events?: (0 | 1);
            };
            attackedCountries?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
              international_response?: (0 | 1);
              war_crimes_documentation?: (0 | 1);
              human_rights_violations?: (0 | 1);
              genocide_info?: (0 | 1);
              chemical_weapons_info?: (0 | 1);
              displacement_info?: (0 | 1);
              reconstruction_status?: (0 | 1);
              international_sanctions?: (0 | 1);
              notable_war_events?: (0 | 1);
            };
            attackedProvinces?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            attackedCities?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
          };
        };
      };


      remove: {
        set: {
          _id: string;
          hardCascade?: boolean;
        };
        get: {
          _id?: (0 | 1);
          title?: (0 | 1);
          description?: (0 | 1);
          selected_language?: (0 | 1);
          createdAt?: (0 | 1);
          updatedAt?: (0 | 1);
          documentFiles?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            mimeType?: (0 | 1);
            type?: (0 | 1);
            alt_text?: (0 | 1);
          };
          report?: {
            _id?: (0 | 1);
            title?: (0 | 1);
            description?: (0 | 1);
            location?: (0 | 1);
            address?: (0 | 1);
            status?: (0 | 1);
            priority?: (0 | 1);
            selected_language?: (0 | 1);
            crime_occurred_at?: (0 | 1);
          };
        };
      };


      count: {
        set: {
          search?: string;
        };
        get: {
          qty?: string;
        };
      };


    }


    blogPost: {


      add: {
        set: {
          title: string;
          slug: string;
          content: string;
          isPublished: boolean;
          isFeatured: boolean;
          publishedAt?: string;
          createdAt?: Date;
          updatedAt?: Date;
          coverImage?: string;
          tags?: string[];
        };
        get: {
          _id?: (0 | 1);
          title?: (0 | 1);
          slug?: (0 | 1);
          content?: (0 | 1);
          isPublished?: (0 | 1);
          isFeatured?: (0 | 1);
          publishedAt?: (0 | 1);
          createdAt?: (0 | 1);
          updatedAt?: (0 | 1);
          author?: {
            _id?: (0 | 1);
            first_name?: (0 | 1);
            last_name?: (0 | 1);
            gender?: (0 | 1);
            address?: (0 | 1);
            level?: (0 | 1);
            email?: (0 | 1);
            is_verified?: (0 | 1);
          };
          coverImage?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            mimeType?: (0 | 1);
            type?: (0 | 1);
            alt_text?: (0 | 1);
          };
          tags?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            color?: (0 | 1);
            icon?: (0 | 1);
          };
        };
      };


      get: {
        set: {
          _id?: string;
          slug?: string;
        };
        get: {
          _id?: (0 | 1);
          title?: (0 | 1);
          slug?: (0 | 1);
          content?: (0 | 1);
          isPublished?: (0 | 1);
          isFeatured?: (0 | 1);
          publishedAt?: (0 | 1);
          createdAt?: (0 | 1);
          updatedAt?: (0 | 1);
          author?: {
            _id?: (0 | 1);
            first_name?: (0 | 1);
            last_name?: (0 | 1);
            gender?: (0 | 1);
            address?: (0 | 1);
            level?: (0 | 1);
            email?: (0 | 1);
            is_verified?: (0 | 1);
            avatar?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            national_card?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            province?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            city?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            uploadedAssets?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            reports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
            blogPosts?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              slug?: (0 | 1);
              content?: (0 | 1);
              isPublished?: (0 | 1);
              isFeatured?: (0 | 1);
              publishedAt?: (0 | 1);
            };
          };
          coverImage?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            mimeType?: (0 | 1);
            type?: (0 | 1);
            alt_text?: (0 | 1);
            uploader?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
          };
          tags?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            color?: (0 | 1);
            icon?: (0 | 1);
            registrar?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            reports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
            blogPosts?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              slug?: (0 | 1);
              content?: (0 | 1);
              isPublished?: (0 | 1);
              isFeatured?: (0 | 1);
              publishedAt?: (0 | 1);
            };
          };
        };
      };


      gets: {
        set: {
          page?: number;
          limit?: number;
          skip?: number;
          search?: string;
          isPublished?: boolean;
          isFeatured?: boolean;
          authorId?: string;
          tagIds?: string[];
          sortBy?: ("publishedAt" | "createdAt" | "updatedAt" | "title");
          sortOrder?: ("asc" | "desc");
        };
        get: {
          _id?: (0 | 1);
          title?: (0 | 1);
          slug?: (0 | 1);
          content?: (0 | 1);
          isPublished?: (0 | 1);
          isFeatured?: (0 | 1);
          publishedAt?: (0 | 1);
          createdAt?: (0 | 1);
          updatedAt?: (0 | 1);
          author?: {
            _id?: (0 | 1);
            first_name?: (0 | 1);
            last_name?: (0 | 1);
            gender?: (0 | 1);
            address?: (0 | 1);
            level?: (0 | 1);
            email?: (0 | 1);
            is_verified?: (0 | 1);
            avatar?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            national_card?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            province?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            city?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            uploadedAssets?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            reports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
            blogPosts?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              slug?: (0 | 1);
              content?: (0 | 1);
              isPublished?: (0 | 1);
              isFeatured?: (0 | 1);
              publishedAt?: (0 | 1);
            };
          };
          coverImage?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            mimeType?: (0 | 1);
            type?: (0 | 1);
            alt_text?: (0 | 1);
            uploader?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
          };
          tags?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            color?: (0 | 1);
            icon?: (0 | 1);
            registrar?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            reports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
            blogPosts?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              slug?: (0 | 1);
              content?: (0 | 1);
              isPublished?: (0 | 1);
              isFeatured?: (0 | 1);
              publishedAt?: (0 | 1);
            };
          };
        };
      };


      update: {
        set: {
          _id: string;
          title?: string;
          slug?: string;
          content?: string;
          isPublished?: boolean;
          isFeatured?: boolean;
          publishedAt?: string;
        };
        get: {
          _id?: (0 | 1);
          title?: (0 | 1);
          slug?: (0 | 1);
          content?: (0 | 1);
          isPublished?: (0 | 1);
          isFeatured?: (0 | 1);
          publishedAt?: (0 | 1);
          createdAt?: (0 | 1);
          updatedAt?: (0 | 1);
          author?: {
            _id?: (0 | 1);
            first_name?: (0 | 1);
            last_name?: (0 | 1);
            gender?: (0 | 1);
            address?: (0 | 1);
            level?: (0 | 1);
            email?: (0 | 1);
            is_verified?: (0 | 1);
            avatar?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            national_card?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            province?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            city?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            uploadedAssets?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            reports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
            blogPosts?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              slug?: (0 | 1);
              content?: (0 | 1);
              isPublished?: (0 | 1);
              isFeatured?: (0 | 1);
              publishedAt?: (0 | 1);
            };
          };
          coverImage?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            mimeType?: (0 | 1);
            type?: (0 | 1);
            alt_text?: (0 | 1);
            uploader?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
          };
          tags?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            color?: (0 | 1);
            icon?: (0 | 1);
            registrar?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            reports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
            blogPosts?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              slug?: (0 | 1);
              content?: (0 | 1);
              isPublished?: (0 | 1);
              isFeatured?: (0 | 1);
              publishedAt?: (0 | 1);
            };
          };
        };
      };


      updateRelations: {
        set: {
          _id: string;
          coverImage?: string;
          tags?: string[];
          removeTags?: string[];
        };
        get: {
          _id?: (0 | 1);
          title?: (0 | 1);
          slug?: (0 | 1);
          content?: (0 | 1);
          isPublished?: (0 | 1);
          isFeatured?: (0 | 1);
          publishedAt?: (0 | 1);
          createdAt?: (0 | 1);
          updatedAt?: (0 | 1);
          author?: {
            _id?: (0 | 1);
            first_name?: (0 | 1);
            last_name?: (0 | 1);
            gender?: (0 | 1);
            address?: (0 | 1);
            level?: (0 | 1);
            email?: (0 | 1);
            is_verified?: (0 | 1);
            avatar?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            national_card?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            province?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            city?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            uploadedAssets?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            reports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
            blogPosts?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              slug?: (0 | 1);
              content?: (0 | 1);
              isPublished?: (0 | 1);
              isFeatured?: (0 | 1);
              publishedAt?: (0 | 1);
            };
          };
          coverImage?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            mimeType?: (0 | 1);
            type?: (0 | 1);
            alt_text?: (0 | 1);
            uploader?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
          };
          tags?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            color?: (0 | 1);
            icon?: (0 | 1);
            registrar?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            reports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
            blogPosts?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              slug?: (0 | 1);
              content?: (0 | 1);
              isPublished?: (0 | 1);
              isFeatured?: (0 | 1);
              publishedAt?: (0 | 1);
            };
          };
        };
      };


      remove: {
        set: {
          _id: string;
          hardCascade?: boolean;
        };
        get: {
          _id?: (0 | 1);
          title?: (0 | 1);
          slug?: (0 | 1);
          content?: (0 | 1);
          isPublished?: (0 | 1);
          isFeatured?: (0 | 1);
          publishedAt?: (0 | 1);
          createdAt?: (0 | 1);
          updatedAt?: (0 | 1);
          author?: {
            _id?: (0 | 1);
            first_name?: (0 | 1);
            last_name?: (0 | 1);
            gender?: (0 | 1);
            address?: (0 | 1);
            level?: (0 | 1);
            email?: (0 | 1);
            is_verified?: (0 | 1);
          };
          coverImage?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            mimeType?: (0 | 1);
            type?: (0 | 1);
            alt_text?: (0 | 1);
          };
          tags?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            color?: (0 | 1);
            icon?: (0 | 1);
          };
        };
      };


      count: {
        set: {
          search?: string;
          isPublished?: boolean;
          authorId?: string;
          tagIds?: string[];
        };
        get: {
          qty?: string;
        };
      };


      publish: {
        set: {
          _id: string;
        };
        get: {
          _id?: (0 | 1);
          title?: (0 | 1);
          slug?: (0 | 1);
          content?: (0 | 1);
          isPublished?: (0 | 1);
          isFeatured?: (0 | 1);
          publishedAt?: (0 | 1);
          createdAt?: (0 | 1);
          updatedAt?: (0 | 1);
          author?: {
            _id?: (0 | 1);
            first_name?: (0 | 1);
            last_name?: (0 | 1);
            gender?: (0 | 1);
            address?: (0 | 1);
            level?: (0 | 1);
            email?: (0 | 1);
            is_verified?: (0 | 1);
            avatar?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            national_card?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            province?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            city?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            uploadedAssets?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            reports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
            blogPosts?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              slug?: (0 | 1);
              content?: (0 | 1);
              isPublished?: (0 | 1);
              isFeatured?: (0 | 1);
              publishedAt?: (0 | 1);
            };
          };
          coverImage?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            mimeType?: (0 | 1);
            type?: (0 | 1);
            alt_text?: (0 | 1);
            uploader?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
          };
          tags?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            color?: (0 | 1);
            icon?: (0 | 1);
            registrar?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            reports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
            blogPosts?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              slug?: (0 | 1);
              content?: (0 | 1);
              isPublished?: (0 | 1);
              isFeatured?: (0 | 1);
              publishedAt?: (0 | 1);
            };
          };
        };
      };


      unpublish: {
        set: {
          _id: string;
        };
        get: {
          _id?: (0 | 1);
          title?: (0 | 1);
          slug?: (0 | 1);
          content?: (0 | 1);
          isPublished?: (0 | 1);
          isFeatured?: (0 | 1);
          publishedAt?: (0 | 1);
          createdAt?: (0 | 1);
          updatedAt?: (0 | 1);
          author?: {
            _id?: (0 | 1);
            first_name?: (0 | 1);
            last_name?: (0 | 1);
            gender?: (0 | 1);
            address?: (0 | 1);
            level?: (0 | 1);
            email?: (0 | 1);
            is_verified?: (0 | 1);
            avatar?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            national_card?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            province?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            city?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            uploadedAssets?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            reports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
            blogPosts?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              slug?: (0 | 1);
              content?: (0 | 1);
              isPublished?: (0 | 1);
              isFeatured?: (0 | 1);
              publishedAt?: (0 | 1);
            };
          };
          coverImage?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            mimeType?: (0 | 1);
            type?: (0 | 1);
            alt_text?: (0 | 1);
            uploader?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
          };
          tags?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            color?: (0 | 1);
            icon?: (0 | 1);
            registrar?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            reports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
            blogPosts?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              slug?: (0 | 1);
              content?: (0 | 1);
              isPublished?: (0 | 1);
              isFeatured?: (0 | 1);
              publishedAt?: (0 | 1);
            };
          };
        };
      };


      getRelated: {
        set: {
          slug: string;
          limit?: number;
        };
        get: {
          _id?: (0 | 1);
          title?: (0 | 1);
          slug?: (0 | 1);
          content?: (0 | 1);
          isPublished?: (0 | 1);
          isFeatured?: (0 | 1);
          publishedAt?: (0 | 1);
          createdAt?: (0 | 1);
          updatedAt?: (0 | 1);
          author?: {
            _id?: (0 | 1);
            first_name?: (0 | 1);
            last_name?: (0 | 1);
            gender?: (0 | 1);
            address?: (0 | 1);
            level?: (0 | 1);
            email?: (0 | 1);
            is_verified?: (0 | 1);
            avatar?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            national_card?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            province?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            city?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            uploadedAssets?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            reports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
            blogPosts?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              slug?: (0 | 1);
              content?: (0 | 1);
              isPublished?: (0 | 1);
              isFeatured?: (0 | 1);
              publishedAt?: (0 | 1);
            };
          };
          coverImage?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            mimeType?: (0 | 1);
            type?: (0 | 1);
            alt_text?: (0 | 1);
            uploader?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
          };
          tags?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            color?: (0 | 1);
            icon?: (0 | 1);
            registrar?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            reports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
            blogPosts?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              slug?: (0 | 1);
              content?: (0 | 1);
              isPublished?: (0 | 1);
              isFeatured?: (0 | 1);
              publishedAt?: (0 | 1);
            };
          };
        };
      };


      getBySlug: {
        set: {
          slug: string;
        };
        get: {
          _id?: (0 | 1);
          title?: (0 | 1);
          slug?: (0 | 1);
          content?: (0 | 1);
          isPublished?: (0 | 1);
          isFeatured?: (0 | 1);
          publishedAt?: (0 | 1);
          createdAt?: (0 | 1);
          updatedAt?: (0 | 1);
          author?: {
            _id?: (0 | 1);
            first_name?: (0 | 1);
            last_name?: (0 | 1);
            gender?: (0 | 1);
            address?: (0 | 1);
            level?: (0 | 1);
            email?: (0 | 1);
            is_verified?: (0 | 1);
            avatar?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            national_card?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            province?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            city?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              english_name?: (0 | 1);
            };
            uploadedAssets?: {
              _id?: (0 | 1);
              name?: (0 | 1);
              mimeType?: (0 | 1);
              type?: (0 | 1);
              alt_text?: (0 | 1);
            };
            reports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
            blogPosts?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              slug?: (0 | 1);
              content?: (0 | 1);
              isPublished?: (0 | 1);
              isFeatured?: (0 | 1);
              publishedAt?: (0 | 1);
            };
          };
          coverImage?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            mimeType?: (0 | 1);
            type?: (0 | 1);
            alt_text?: (0 | 1);
            uploader?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
          };
          tags?: {
            _id?: (0 | 1);
            name?: (0 | 1);
            color?: (0 | 1);
            icon?: (0 | 1);
            registrar?: {
              _id?: (0 | 1);
              first_name?: (0 | 1);
              last_name?: (0 | 1);
              gender?: (0 | 1);
              address?: (0 | 1);
              level?: (0 | 1);
              email?: (0 | 1);
              is_verified?: (0 | 1);
            };
            reports?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              description?: (0 | 1);
              location?: (0 | 1);
              address?: (0 | 1);
              status?: (0 | 1);
              priority?: (0 | 1);
              selected_language?: (0 | 1);
              crime_occurred_at?: (0 | 1);
            };
            blogPosts?: {
              _id?: (0 | 1);
              title?: (0 | 1);
              slug?: (0 | 1);
              content?: (0 | 1);
              isPublished?: (0 | 1);
              isFeatured?: (0 | 1);
              publishedAt?: (0 | 1);
            };
          };
        };
      };


    }


  }


};


export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export const lesanApi = (
  { URL, settings, baseHeaders }: {
    URL: string;
    settings?: Record<string, any>;
    baseHeaders?: Record<string, any>;
  },
) => {
  const setting = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...baseHeaders,
    },
    ...settings,
  };

  const setHeaders = (headers: Record<string, any>) => {
    setting.headers = {
      ...setting.headers,
      ...headers,
    };
  };

  const getSetting = () => setting;

  const send = async <
    TService extends keyof ReqType,
    TModel extends keyof ReqType[TService],
    TAct extends keyof ReqType[TService][TModel],
    // @ts-ignore: Unreachable code error
    TSet extends DeepPartial<ReqType[TService][TModel][TAct]["set"]>,
    // @ts-ignore: Unreachable code error
    TGet extends DeepPartial<ReqType[TService][TModel][TAct]["get"]>,
  >(body: {
    service?: TService;
    model: TModel;
    act: TAct;
    details: {
      set: TSet;
      get: TGet;
    };
  }, additionalHeaders?: Record<string, any>) => {
    const req = await fetch(URL, {
      ...getSetting(),
      headers: {
        ...getSetting().headers,
        ...additionalHeaders,
        connection: "keep-alive",
      },
      body: JSON.stringify(body),
    });

    return await req.json();
  };

  return { send, setHeaders };
};


