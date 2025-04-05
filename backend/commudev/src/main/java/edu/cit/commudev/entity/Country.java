package edu.cit.commudev.entity;


/**
 * Enumeration of Countries for dropdown selection
 */
public enum Country {
    // Most populous/common countries first
    US("United States"),
    CN("China"),
    IN("India"),
    ID("Indonesia"),
    PK("Pakistan"),
    BR("Brazil"),
    NG("Nigeria"),
    BD("Bangladesh"),
    RU("Russia"),
    MX("Mexico"),
    JP("Japan"),
    PH("Philippines"),
    EG("Egypt"),
    VN("Vietnam"),
    TR("Turkey"),
    IR("Iran"),
    DE("Germany"),
    TH("Thailand"),
    GB("United Kingdom"),
    FR("France"),
    IT("Italy"),
    ZA("South Africa"),
    TZ("Tanzania"),
    MM("Myanmar"),
    KR("South Korea"),
    CO("Colombia"),
    ES("Spain"),
    UA("Ukraine"),
    AR("Argentina"),
    DZ("Algeria"),
    SD("Sudan"),
    UG("Uganda"),
    IQ("Iraq"),
    PL("Poland"),
    CA("Canada"),
    MA("Morocco"),
    SA("Saudi Arabia"),
    UZ("Uzbekistan"),
    PE("Peru"),
    MY("Malaysia"),
    AO("Angola"),
    GH("Ghana"),
    MZ("Mozambique"),
    YE("Yemen"),
    NP("Nepal"),
    VE("Venezuela"),
    MG("Madagascar"),
    CM("Cameroon"),
    CI("Côte d'Ivoire"),
    AU("Australia"),
    NL("Netherlands"),
    BE("Belgium"),
    GR("Greece"),
    CL("Chile"),
    SE("Sweden"),
    PT("Portugal"),
    SG("Singapore"),
    CH("Switzerland"),
    IE("Ireland"),
    NO("Norway"),
    NZ("New Zealand"),
    // Add more countries as needed
    OTHER("Other");

    private final String displayName;

    Country(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getCode() {
        return this.name();
    }

    @Override
    public String toString() {
        return displayName;
    }
}