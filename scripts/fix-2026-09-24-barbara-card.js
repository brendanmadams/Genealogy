#!/usr/bin/env node
/**
 * 2026-09-24, reorganizes Barbara McKeldin Adams's card. Her memoir chapters
 * had been abstracted into every section at once, so the same event appeared
 * up to five times (in childhood, milestones, stories, notes and places).
 * Each item now sits in one section:
 *  - milestones: dated life events, in order (homes and moves included)
 *  - childhood / education / career / hard times: one merged item per subject
 *  - stories: anecdotes and her reflections, grouped by subject
 *  - research notes: findings about sources and dates only
 *  - places: one entry per place, with the sites there in parentheses
 * Re-runnable: it writes the same content each time.
 */
'use strict';
const { load, save } = require('./lib/records');
const p = load('barbara_mckeldin_adams');

p.roles = [
  "Wife, mother and grandmother, the roles she most wants to be remembered for",
  "Teacher and college educator",
  "Navy wife",
  "Youth soccer coach",
  "Quilter, crafter and church volunteer",
];

p.personality = [
  "curious and adventurous", "bold", "outdoorsy",
  "intellectually curious, above all about history and science", "curious about her own family history",
  "deeply interested in Abraham Lincoln", "serious about academics and research", "avid reader", "music-loving",
  "enthusiastic sports fan", "strong-willed", "independent", "defiant with authority as a child", "trouble-prone in childhood",
  "tomboyish", "tough", "competitive", "fit",
  "quick to react when mocked, and particular about names and nicknames",
  "hardworking and driven", "disciplined", "determined to prove herself", "persistent",
  "resourceful", "practical", "strategic",
  "adaptable, after some initial reluctance", "thinks carefully before deciding", "reflective and self-aware", "self-critical",
  "committed educator", "family-centered", "protective", "deeply affectionate", "sentimental and nostalgic",
  "empathetic and compassionate", "emotionally intense", "moved by national events", "patriotic",
  "admiring of the public figures in her family", "deeply admiring of Marie Ellinghaus-Quinn",
  "devout Catholic", "generous and charitable", "humble", "supportive", "proud", "social", "loyal friend",
  "storyteller", "humorous and self-deprecating", "observant", "skeptical", "resilient",
  "appreciative of thoughtful gestures", "relaxed and content in retirement",
];

p.milestones = [
  "Born 12 Feb 1948 in Baltimore, Maryland, on Abraham Lincoln's birthday; she walked at seven months.",
  "1950, 24 Oct: Her mother, Emily (Schriefer) McKeldin, died, when Barbara was two and a half.",
  "1951, 12 May: Her maternal grandfather, George 'Goode' Schriefer, died.",
  "1952, 9 Apr: Her maternal grandmother, Ethel (Quinn) Schriefer, died; Barbara and Chuck moved to the Quinn household on Nicklas Avenue.",
  "About 1962: Graduated from eighth grade at St. Dominic's and started at Mercy High School.",
  "1963, 22 Nov: Heard of President Kennedy's assassination in class, as a Mercy High sophomore.",
  "About 1966: Graduated from Mercy High School, took her first job, at Hochschild Kohn, that summer, and started at Towson State College (a timeline gives 1967 for Towson).",
  "1967: Met John Adams, at the end of his second (Youngster) year at the Naval Academy.",
  "Summer 1968: Began dating John, between his third and fourth years at the Academy.",
  "Nov 1968: At the Army-Navy weekend in Philadelphia she and John first talked about marriage.",
  "1969, Feb: Became engaged; she and John went diamond shopping in Annapolis. On her 21st birthday, 12 Feb 1969, her father surprised her with her mother's jewelry.",
  "Dec 1969: Graduated early from Towson State College.",
  "Married John Howard Adams (m. 31 Jan 1970), in the Catholic Church.",
  "1970: Right after the wedding she moved to Milton, Florida, John's first duty station; the drive there was their only honeymoon. They moved five times in their first three years of marriage.",
  "About 1970: When the Navy sent John to Beeville, Texas, with 'no dependents' housing, they spent two days in a hotel, stayed with a classmate of John's, then rented an unfinished house from the landlord, Henry Isler, finishing it in exchange for three months' free rent; Navy couple Cindy and Bob Riera lived next door.",
  "About 1971-1972: In Meridian, Mississippi, she taught at Kate Griffin Junior High until she was let go for being pregnant.",
  "1972: Her son Brian was born in Meridian, Mississippi.",
  "About 1974-1976: The family lived two years in Oak Harbor, Washington, while John flew from the USS Ranger; her son Brendan was born at the naval base on Whidbey Island.",
  "About 1976-1978: They lived two and a half years in Port Townsend, Washington, after John left active duty.",
  "About 1978-1979: They lived 18 months in Gilroy, California, while her brother Chuck was at the Naval Postgraduate School in Monterey.",
  "1979: Moved to Kelso, Washington; she began substitute teaching at St. Rose School.",
  "About 1985: Research trip around Washington for her master's thesis.",
  "1988: Turned 40.",
  "1990: Spent their 20th wedding anniversary on Maui.",
  "1993: Alaska cruise with John, her father and stepmother (Granny and Pops), and Nana (Beryl) and Bob.",
  "About 1995-1996: The family lived about a year in Redding, California, then moved to an apartment in Vancouver, Washington; their dog Snickers died in 1996, while they were still in Redding.",
  "About 1996-1998: Worked at the University of Portland.",
  "In Vancouver, Washington, they rented at first and then bought a Victorian house next to the WSU campus.",
  "About 2002-2005: Running Start coordinator at Lower Columbia College, living in Ridgefield, Washington, and commuting to Longview while John worked away (driving truck, consulting, then in New Mexico). When John took the New Mexico job they sold the Vancouver house and she lived in an apartment in Vancouver.",
  "2005, Mar: Finished her quarter at Lower Columbia College and joined John in Crownpoint, New Mexico, about two years after he moved there; they had lived apart for two to three years.",
  "2010: Retired at 62, as she and John had planned, after five years at Crownpoint.",
  "2010: She and John moved back from New Mexico to Ridgefield, Washington, arriving in the Vancouver area that January.",
  "2012: Bus tour of Ireland and the Continent, staying in Dublin, Vienna, Salzburg, the Black Forest and Paris.",
  "2015: Caribbean cruise from Fort Lauderdale.",
  "2016: Cruise around South America, starting with Iguazu Falls and Buenos Aires, visiting the Falklands and Patagonia and rounding the tip of the continent.",
  "2017: Watched Brendan race the UTMB at Mont Blanc, then toured Spain, Portugal and Gibraltar by bus.",
  "Became a grandparent.",
  "2020: Stopped substitute teaching for the Ridgefield School District when the pandemic closed the schools, after nine years.",
];

p.childhood_experience = [
  "Her earliest memory is the circus. The family did not get a TV until she was six.",
  "She describes her childhood mainly in terms of freedom: long summer days outside until dinner, school days outside from three o'clock until dinner, and skating through the neighborhood after dinner while the adults sat on their porches. She climbed in the quarry and up trees, waded in streams for crawdads, played baseball, stole peaches from the blind school with other children, and once chased a flasher and threw rocks at him.",
  "Raised between two brothers, many male first cousins and the boys next door, she preferred playing with boys and learned to stick up for herself; she bloodied a few noses and earned a reputation for being competitive and willful. She had only two play dates with a girly-girl who lived two blocks away, and they did not go well.",
  "She had 26 male and 6 female first cousins; the nearest girl cousin in age, Sharon, was born when Barbara was ten (about 1958). Cousins she names include Quinn, Tommy, Mark, Tim, Michael, Sharon, John, Joanie, Matthew, Billy (Chuck's age) and Bobbie. She spent Sundays with them at her grandmother's house, sometimes all day and into the night, and explored Herring Run Park with them. [Barbara McKeldin Adams, A Memoir, text line 947]",
  "She hated being called Babs or Babsie by her father's family and cringed when her aunts used it. She hit or pinched Chuck when he called her Babs, chasing him when he ran, and beat up his friends who tried it; she says Tommy Dudek was a slow learner. Her cousins generally called her Barb or Barbara. At school she was 'Chuck's little sister' to Chuck's friends and even to the nuns, and only three people called her by her given name: Miss Rail, Mrs. Cronin and Sister Mary Robert.",
  "She and Chuck shared a birthday party every year on the weekend between their birthdays. Near her eleventh birthday they shared it because her beloved grandfather had died around then, which made that birthday especially sad and memorable. He had been her best friend growing up: she remembers Veterans Day poppies, doughnuts, magic tricks, poetry, his piano playing, and his babysitting.",
  "She loved being read to and treasured the early books her family gave her; she went to the library every Saturday and was proud of her library card.",
  "Born on Lincoln's birthday, she became an encyclopedia on Abraham Lincoln and made her father take her to the Lincoln Memorial, the Smithsonian and Gettysburg; she still reads new books about Lincoln. Growing up in Maryland she took many school field trips to historical and civic sites, and remembers visiting the State House in Annapolis because of her great-uncle Teddy's political role.",
  "She describes Theodore R. McKeldin, her great-uncle, as her hero, and remained proud to be his great-niece and a McKeldin.",
  "Her favorite teams were the Baltimore Orioles and the Baltimore Colts. Her dad took the family to many Colts games and Orioles games at Memorial Stadium, which sold out when the Yankees, the Orioles' nemesis, came to town; she collected baseball cards of the Yankees players of the 1950s and 1960s. She was the best bowler in her duckpin league and age group and qualified for Duckpins for Dollars, and she played YWCA basketball for three years.",
  "As a child she went with her family to a Quaker family's furniture barn in Pennsylvania, where her parents chose the wood and design for two end tables and a coffee table, and the children drank sassafras root beer.",
  "She babysat for neighbors and aunts, and volunteered with first-graders and migrant children.",
];

p.education = [
  "St. Dominic's School, Baltimore, first through eighth grade. She was sent to the principal's office often (see Stories).",
  "Mercy High School, Baltimore, from about 1962 to about 1966. She did not want to go to Seton High because her mother had gone there. She shared no classes with her friends Louise and Jeanne and had to make new friends, then ran with a close-knit pack of friends all four years; she mostly took the transit system to school. There were 95 students in the class, and everyone knew one another. She played JV basketball and intramural field hockey and softball, went to dances and the prom, double-dated, spent time at Paula's Ocean City house when it was free, and acted in school plays: The Wizard of Oz, Alibaba and the 40 Thieves, Peter Pan and Alice in Wonderland.",
  "Towson State College, from about 1966, the only college her father could afford; she went to earn teaching credentials, lived at home, commuted and worked through college, and stayed friends with her high school group. She came in with an open mind, at first considering veterinary medicine, and chose professors carefully by reputation. A Western Civilization professor who made history come alive with vivid detail, such as Marie Antoinette and court life, led her to declare History; she added a double major in Social Studies (economics, psychology, political science, sociology and geography), including Macro and Micro Economics. An above-average student who took her studies seriously, she took summer classes all three years, mostly English and science; a summer Botany class made her fascinated by flowers, shrubs and trees. She played intramural lacrosse. The summer classes let her graduate early, in December 1969, and she married in January.",
  "Master of Arts, Seattle Pacific College (Seattle Pacific University), with a thesis on the history of Washington State; Nana and Papa helped with child care while she earned the credits. The research trip, when Brendan was ten and Brian thirteen (about summer 1985), was a family vacation: towing a boat through the Columbia Gorge and eastern Washington to Lake Chelan, visiting lakes and museums, and tracing the path of the ancient Columbia River. She defended the thesis in her advisor's office with only the advisor present, and felt she got off easy.",
  "She also lists the University of Portland among the schools she attended.",
];

p.career = [
  "Volunteered at Stella Maris Nursing Home in the summers after her freshman, sophomore and junior years of high school.",
  "Hochschild Kohn department store, Towson area, her first job, from about 1966. She applied for sales jobs at department stores near Towson State College and was turned down by several; she got an interview after her dad called Uncle Ted McKeldin. She was trained on the cash register, returns and customer politeness, and worked in lingerie and pajamas, helped in hosiery and sometimes in the candy department, for four and a half years. Mrs. Grey watched her closely, kept reminding her how she got the job and seemed to wait for mistakes; Barbara became a model employee because she felt fortunate to have the job and did not want to let Uncle Teddy down. She says she went through five boyfriends while working there, and John was the sixth and final one.",
  "As a Navy wife she took whatever jobs were available. In Milton, Florida, she worked at Pen Bay Laboratories (Pen-Bay Laboratory, Pensacola), in a tense specimen-cataloguing job that demanded precision; she worked days while John flew nights, and they switched seats in the car.",
  "In Beeville, Texas, she substituted in the school district and taught in-school detention.",
  "In Meridian, Mississippi, she taught seventh grade, team-teaching science and English at Kate Griffin Junior High in the second year of desegregation, and bridged the racial divide in her classroom by using Archie Manning as a common topic. One of her students was Brenda Chaney, sister of the civil-rights worker James Chaney, who was murdered by the Klan for registering Black voters. She got pregnant with Brian that summer and was let go, because pregnant teachers were not allowed.",
  "A stay-at-home mother in Oak Harbor, Port Townsend and Gilroy: in Oak Harbor she sat on the board of Brian's preschool and volunteered there two or three days a week, in Port Townsend she helped form a preschool, and in Gilroy she volunteered and taught in Brian's classroom.",
  "St. Rose School, Longview (from 1979): she substituted, then taught sixth and seventh grade. She compared its demanding conditions to Pen Bay Laboratories. She also taught CCD in Kelso.",
  "Lower Columbia College, Longview, twelve years in one stretch: tutor, including for students with dyslexia; Study Skills instructor; testing staff member and Testing Coordinator for Ernie Cadman; night classes for high school students in U.S. Government and history; and INDV 90, How To Succeed in College. She says she learned valuable lessons from Cambodian students there.",
  "Redding, California (about 1995-1996): a superintendent questioned paying her at a master's degree salary and steered her to Shasta Community College, where she worked in the Registrar's Office.",
  "She was hired in the University of Portland School of Education after interviewing with Ellyn Arwood, who became her boss, and Dean Sister Maria, and worked there about two years in the outreach master's program, in recruiting and coordination, including travel to Canada and Guam. (about 1996-1998)",
  "Back at Lower Columbia College for about three years as Running Start Coordinator, where she learned budgeting and counseling skills (about 2002-2005).",
  "At Crownpoint High School, New Mexico, she was hired on the spot by the long-time principal Mr. (Bruce) Helms and worked four years under him; after he retired she stayed one more year and left when her five years were up in March (2005-about 2010). She taught high school Study Skills and English Literature, monitored all the AP classes, and designed a movie elective after polling her students, which became very popular. In her final year she was Head of the English Department, after Paula Wackenheim and Kyle moved to Oklahoma City. She resigned at the end of a semester, after repeated vandalism and no support from the administration, and later regretted ending her career that way; she says she is ashamed she deserted the kids. She remarks that her New Mexico retirement after five years matched her Washington retirement after twenty.",
  "She and John both retired at 62, as they had planned (about 2010 for Barbara). She then worked nine years as a substitute for the Ridgefield School District, until the pandemic shut the schools down.",
];

p.risk_events = [
  "Her mother died on 24 Oct 1950, when Barbara was two and a half; she and Chuck went to live at their maternal grandmother's house. After Ethel died on 9 Apr 1952 they moved in with Ethel's brother John Joseph Quinn and his wife Marie Ellinghaus-Quinn on Nicklas Avenue, whose four children were Margaret 'Peggy' (in nursing school), Joan (a telephone operator), and the teenagers John and Pat. Since her mother died so young, and men were not allowed in the delivery room, she grew up hearing no stories about her own birth.",
  "The insurance feud: Emily's first husband, Jack Poleman, a naval aviator shot down on D-Day, left a policy naming Emily as beneficiary. Before marrying Buckey she redirected it to her brothers Kenneth and George Schriefer Jr. and never changed it back; after she died in 1950 her brothers took the money, which caused Buckey's lifelong falling-out with his brothers-in-law (memoir pp. 13-14).",
  "As a child she almost bled to death, and rode home from the park with her coat soaked in blood.",
  "Beeville, Texas: the unfinished house they fixed up had wildlife and limited utilities, and she cooked on a one-burner hot plate; she says they survived Hurricane Camille there (see Research notes).",
  "Meridian, Mississippi, 1972: the KKK was active, and they woke up to crosses visible on front lawns; she was fired for being pregnant.",
  "When Brendan was burned she heard him scream, immediately removed his pajamas (medical staff told her this prevented worse burns) and rushed him to the emergency room, where staff who suspected child abuse restrained her and questioned her for thirty minutes. Shocked to be suspected, she called California a strange place, and after a later injury to Brian she had John take him to the hospital to avoid suspicion.",
  "She handled other emergencies with her sons, including a ferry incident, an earthquake in Gilroy and injuries; decades later she still feels anxious about Brendan's ferry incident.",
  "She fired Janice after learning Janice had been stealing from her and the boys.",
  "In Crownpoint she resigned after repeated vandalism and no support from the administration.",
];

p.notable_stories = [
  // school
  "Grade school at St. Dominic's: on the first day of first grade she followed Chuck onto the boys' side of the bus and into the boys' bathroom and was sent to the principal's office, the first of many visits, for the pencil incident (in fourth grade a rubber band launched her pencil into the principal's habit), the playground incident, the banister incident (sliding down a railing, she fell onto Sister Angela and knocked off her headpiece), the confession incident, the black eye incident (she gave Andrew Pulaski a black eye after he kept snapping her bra straps on a crowded bus), the Brownie incident, and the signature incident (in second grade she signed a spelling paper for her mother and was punished). She also lip-synced in choir to avoid singing, and was removed for singing off key. She says this was not her favorite story at the time she was living it.",
  "Fred the gerbil was sucked up in the vacuum.",
  "Famous encounters: she met the Orioles' Brooks Robinson and Gus Triandos, who signed her baseball card; talked to Johnny Unitas at the Golden Arm restaurant and to Alan Ameche when he came out to the car at one of his drive-ins; and saw Paul Simon and Art Garfunkel perform up close in a small auditorium at Towson State, when they were first getting started.",
  "The Beatles at Mercy High: when an unusual announcement came over the speaker she left class to investigate and ran into George Harrison and John Lennon in the hallway. She got a week of detention for being caught outside class, and felt it was worth it.",
  "President Kennedy's assassination: a Mercy High sophomore, she heard the announcement over the intercom in Sister John Mary's history classroom, and the whole school went to the gym to say a rosary, because the chapel was too small. She stayed glued to the TV all weekend, which felt bizarre and full of conspiracy theories, and cried when John-John saluted his father's casket.",
  "Martin Luther King's assassination: she remembers Walter Cronkite interrupting the evening news, watched the coverage and the funeral on television, and believed Jesse Jackson was at the Lorraine Hotel in Memphis at the time; it did not affect her as deeply as JFK's assassination and funeral.",
  "She watched the moon landing on television, found it amazing, and followed the news coverage of Neil Armstrong for the next six months.",
  // courtship and marriage
  "The Army-Navy weekend at the end of November 1968 in Philadelphia was closely chaperoned by family: John's parents George and Beryl came, with Ralph, Rosemary and Louise O'Dell, Pete and Betty O'Neil, and the O'Donalds, and Barbara shared a hotel room with Uncle Ralph and Aunt Rosemary. They had dinner at Bookbinder's Restaurant and went to the game (Army won 21-14). When the adults went back to Washington State she and John were left alone in two connecting hotel rooms and talked about marriage for the first time.",
  "In February 1969 she and John went diamond shopping in Annapolis and picked out a diamond and setting at Tilghman's Company. John proposed in the basement of her house.",
  "She says they have been married 52 years and he still makes her laugh; she describes him as optimistic and central to her happiness, supportive but often away for work and the Navy Reserves.",
  "Super Bowl bets: she lost a lunch bet to Lowell Tiller and sent him a peanut butter and jelly sack lunch by way of John during a Reserve weekend. She won a later bet by picking the 49ers, because she liked Joe Montana, and Lowell sent a catered lunch from Henry's to her at St. Rose School.",
  // the boys
  "Naming the boys: she went into the hospital with a list of names and wanted to avoid nicknames. Brian was the only first name she and John both liked, and John was his middle name without argument. They both picked Brendan before the hospital for their second son, and chose McKeldin together as his middle name because it was her family name.",
  "The road trip from Meridian, Mississippi, to San Diego with one-year-old Brian was a disaster: a diaper blowout meant leaving his ruined clothes and shoes by the roadside, a freshly paved road covered the car in tar, and the car wash stripped the paint. They stayed at the Navy Lodge while John attended Survival School. She says this first trip with Brian was rough, but later trips with the kids were happier.",
  "Motherhood deeply changed her, and she centered her life around Brian and Brendan. Her heart overflowed with love when Brian met Brendan through the hospital window; she cheered both boys on as they rolled over, crawled and took their first steps; and she enjoyed being a stay-at-home mother in Port Townsend, playing with her children. She wanted them to know their grandparents, get a good education, be raised in the Catholic faith, and have fun.",
  "Brendan tried to run away from home at his third birthday party in Ocean City after being sent for a timeout.",
  "Family travel: repeated trips back east, and trips for museums, historic sites, skiing, camping, rafting and theme parks. She drove the boys to Disneyland to meet the Hinns and was scolded by a hotel manager after the boys bounced on the bed.",
  "In Gilroy she built new friendships and routines; in Redding she joined a small book club and kept those friendships.",
  "In Kelso she and John rejected the Clatskanie schools as not up to their standards and enrolled the boys in St. Rose School, then Coweeman Junior High and Kelso High School.",
  "Soccer: never having played, she agreed to co-coach her younger son's team with Rich Hickey, as assistant coach, and soon realized that neither the coach nor the players understood soccer. She went to the library to study technique, developed structured drills and skills training, and kept coaching until her son reached high school.",
  "SuperMom and SuperWife: she managed work, sports, skiing, teenagers and the household largely on her own, and says she enjoyed every minute of it. She kept a strict diet while skiing with the boys at Mt. Hood.",
  "Fiercely protective: coach Frank took her out of a soccer game when she nearly retaliated against an opposing player; she threatened to quit her job and shadow Brian at school unless his grades improved; she went to war with Brendan's teacher, who accused him of trying to take over the class; and she yelled from the stands when Brendan was being overpowered in football, and later thanked Chris Rabideau.",
  "The dog Snickers went through several surgeries and balance problems in her care.",
  "When Brian left for college she was excited and nervous, cried when she dropped him off at the dorm, and was reassured by his independence and travel experience.",
  "She remembers Brendan telling a joke that made her laugh, though not the details.",
  "Her running career began with Port Townsend's Rhodie Run; with friends Brent and Rosemary Shirley the family took a replica Victorian house float to parades around the Northwest for the Port Townsend Queen's Court, and she later ran the Gilroy Garlic Festival race.",
  // Marie
  "Marie Ellinghaus-Quinn, who took Chuck and her into her home when they were young, became her 'Grandmother Marie', 'the wisest person I've known' (memoir p. 57). Marie taught her not to air family laundry in public, to battle for her children and grandchildren, to be a lifelong learner, and not to be afraid of life. Barbara was with her when she died, on Barbara's birthday, 12 February, and gave her eulogy at the family luncheon.",
  // faith
  "Faith: baptized as a baby, she made her first confession, first communion and confirmation, and describes Catholicism as woven into everyday life growing up in Maryland. Through the Navy moves she kept going to church, attending at least eight churches regularly in the first ten years of marriage; she calls changing churches 'priest-hunting', and says religion became less routine but no less important. Moving from Beeville to San Diego she made John stop in Tucson on a Sunday morning so they could attend church. She felt more at home with church life in Kelso, attended St. Paul's in Crownpoint, and now attends Saint Joe's in Washington and Our Lady of Loreto in Colorado. In retirement she has become more focused on her faith again, and says she has come full circle.",
  "She believes the ultimate purpose of life is to reach heaven with God, that God sets a plan and a path for each person, and that choices should aim at discovering one's mission; she says people come into our lives for a purpose. She identifies with love, joy, peace, patience, kindness, goodness, faithfulness, gentleness and self-control.",
  // reflections
  "Do people change? She says her priorities shifted from self-development as a student, focused on being a good friend and preparing for the future as a single person and college student, to flexibility as a Navy wife, and then to serving her children and grandchildren. She rejects the idea that she resists change: she just thinks longer before deciding, and told her children that if they needed an instant answer it would be no. Her positions are driven by what is best for her family, especially the kids and grandkids, and she says experience made her the woman she is today.",
  "Her advice: treat strangers with respect, kindness and understanding; be aware of emotional triggers in close relationships; never go to bed angry, and apologize when needed; and be safe, disciplined and aware.",
  "Happiness: she finds joy in supporting her children, grandchildren and extended family, and in service and spiritual life. She keeps in daily touch with friends recovering from strokes, works in church ministries including quilting, bereavement and charitable giving, makes and donates quilts, prayer shawls and crafts, and paints rocks to give away.",
  "She designs her own quilts, including an Australian-themed quilt inspired by their trip there, a complex burgundy pattern, a sun design taken from a favorite TV show, and a caricature quilt of her two sons. Soon after moving to Ridgefield she made a quilt for the new baby of the family who own their local Mexican restaurant, El Rancho Viejo, and she has been greeted with hugs there ever since.",
  // tastes
  "Books: she has read widely in fiction, history, mystery and memoir, and in audiobooks, and lists many favorite authors and titles, often with how many books she has read by each; Owen and Garret got her hooked on several authors. She stayed up all night reading Harry Potter and the Sorcerer's Stone when it arrived late from Amazon, read 14 books during the 2020 COVID-19 shutdown, and had listened to 39 books and read 2 in 2021 at the time of writing.",
  "Music: she has loved the Beatles since the early sixties, enough to see the movie Yellow Submarine, and has collected and listened to albums by many artists across several genres; she lists her favorite songs and albums. Elvis Presley's music reminds her of Aunt Pat playing his records, and Bradley Cooper and Lady Gaga's performance of Shallow stands out to her.",
  "Drinks: vodka in college, including a trip to Ocean City with Jan Sneering; wine with John in the early years in Port Townsend and Kelso, until migraines made her stop and eventually become a teetotaler; champagne on special occasions; and her favorite, the chai tea latte.",
  "Food: she loved her mother's meatloaf as a child and the seafood of Maryland, describes the foods she disliked as a child and how she avoided eating them, and now prefers simple bowl meals. Abroad she enjoyed the meals in Finland and other international cuisines, disliked the traditional foods she tried in Scotland, and tells a funny story of getting tipsy during a multi-course meal.",
  "Superstitions: she remembers childhood sayings like stepping on cracks and her grandmother throwing salt over her shoulder, and rejects most superstitions apart from a few playful ones.",
  "Possessions: she calls her family her most precious possessions. Her heirlooms include the black-and-gold rocking chair that was Grandmother Quinn's wedding present, her brother Chuck's youth chair, a pewter tea set her parents gave on their fifth wedding anniversary, her mother's jewelry, and other things from her parents and her birth mother; John gave her a miniature Naval Academy class ring. Mementos of her childhood trips, family traditions, children and grandchildren fill her home.",
  // travel
  "Travel: she compares cruises with bus tours, and has traveled with family, extended family, friends and groups to Alaska, South America, Europe and Oceania, including hiking, snorkeling, wildlife and cultural visits in Peru, Ecuador and the Galapagos, where John stepped in turtle dung and was bitten by fire ants. She reflects on her favorite destinations and would like to go back to some. In Hawaii their trips included stays at the Hale Koa Hotel on Oahu, a Christmas trip, a whole-family trip, and trips with Trudy and with George and Cindy.",
  "In 1993, on the Alaska cruise, they took a helicopter ride to the Mendenhall Glacier and a train ride up into the gold fields.",
  // imagination
  "If she could go back in time she would witness events in the life of Jesus, and she admires Winston Churchill's leadership in the Second World War, comparing it with today's leaders. She considered knowing the future and decided against it. With all the money in the world she would give first to her family, then to religious, educational and charitable causes. Her ideal lazy day is reading, crafts and relaxing.",
  "Health: she discusses a family tendency to hair loss (she saw a dermatologist in the early seventies), family medical history, and scoliosis diagnosed in childhood.",
  "She reflects on the environmental changes in her lifetime. She wants to be remembered as someone who improved the lives of others, and for her roles in her family and community, as wife, mother, grandmother and educator.",
];

p.notes = [
  "Daughter of Charles 'Buckey' McKeldin and Emily Schriefer McKeldin, and granddaughter of Emma Bell McKeldin. Siblings: Charles 'Chuck' McKeldin Jr. (full) and J. Michael 'Mike' McKeldin (half). Her stepmother, Margaret Quinn, is 'Granny'.",
  "Emily Schriefer's death date, 24 Oct 1950, is confirmed by the memoir (p. 13).",
  "CORRECTION: her grandmother Ethel (Quinn) Schriefer died on 9 Apr 1952, per her death notice (Baltimore Sun, 10 Apr 1952), not on 12 Apr as the memoir timeline gave.",
  "CORRECTION CONFIRMED: the Miss Maryland 1968 and Miss World USA 1969 titles belong to Paulette Reck, Barbara's Mercy High School classmate, not to Barbara (corrected in the timeline, 18 Apr 2026).",
  "Mercy High dates: she was already a sophomore when JFK was shot in November 1963, so she started as a freshman around fall 1962. 9 Feb 1964 was the Sunday the Beatles appeared on the Ed Sullivan Show; George Harrison and John Lennon visited Mercy High later that week. [Barbara McKeldin Adams, A Memoir, text line 771]",
  "Barbara probably started at Towson State in fall 1966: she was in the Mercy High class that were sophomores in 1963-64, and she got her first job the summer before college. A timeline gives 1967. [Barbara McKeldin Adams, A Memoir, text line 824]",
  "Barbara recalls surviving Hurricane Camille in Beeville, Texas, but Camille struck in August 1969, before their January 1970 wedding. The storm they lived through in Beeville in 1970 was most likely Hurricane Celia (August 1970). [Barbara McKeldin Adams, A Memoir, text line 1302, 2377]",
  "Sources disagree on the number of Hawaii trips: Barbara thinks eight; John says about ten. [Barbara McKeldin Adams, A Memoir, text line 3952]",
  "Listed in Index of Names under maiden surname MCKELDIN, page 30, no dates [Bill Allen, Descendants of Jose Pierre Adams, 2011, line 5902]",
];

// One entry per place; sites there in parentheses.
p.locations = [
  "Baltimore, Maryland (Nicklas Avenue; St. Dominic's School; Mercy High School; Seton High; Herring Run Park; Memorial Stadium; the Baltimore Zoo; Baltimore Harbor; Fort McHenry; Enoch Pratt Free Library; Stella Maris Nursing Home; the Hecht's, Hutzler's, Stewart's and Hochschild Kohn department stores)",
  "Towson, Maryland (Towson State College)",
  "Annapolis, Maryland (the State House on State Circle; Tilghman's Company)",
  "Ocean City, Maryland", "Chesapeake Bay",
  "Washington, D.C. (the Smithsonian Institution; the White House; the Treasury Building; the Capitol; the Lincoln Memorial; the Washington Monument; the Jefferson Memorial; Arlington National Cemetery)",
  "Mount Vernon, Virginia", "Williamsburg, Virginia", "University of Virginia, Charlottesville",
  "Gettysburg, Pennsylvania", "Philadelphia, Pennsylvania (Bookbinder's Restaurant)", "Hershey, Pennsylvania",
  "Boston", "Chicago", "Memphis, Tennessee (the Lorraine Hotel)",
  "Milton, Florida (Pen Bay Laboratories)", "Pensacola, Florida", "Fort Lauderdale, Florida",
  "Beeville, Texas", "Blueberry Hill",
  "Meridian, Mississippi (Kate Griffin Junior High)",
  "Tucson, Arizona",
  "San Diego, California (the Navy Lodge; the BOQ; the San Diego Zoo; the San Diego Aquarium)",
  "Gilroy, California", "Hollister, California", "Monterey, California", "Santa Barbara, California",
  "Disneyland", "Great America", "Redding, California (Shasta Community College)", "Marie Callender's restaurant", "Lake Shasta",
  "Oak Harbor, Washington (Whidbey Island)", "USS Ranger",
  "Port Townsend, Washington (Chetzemoka Park; Fort Worden; the Port Townsend ferry)",
  "Kelso, Washington (Coweeman Junior High; Kelso High School)",
  "Longview, Washington (St. Rose School; Lower Columbia College)",
  "Vancouver, Washington (the WSU campus; Clark College)", "Ridgefield, Washington (Ridgefield School District)", "Saint Joe's church, Washington",
  "Woodland, Washington", "Olympia, Washington", "Mt. Vernon, Washington",
  "Seattle, Washington (Seattle Pacific University; the University of Washington)",
  "Puget Sound", "Hood Canal", "Lake Chelan", "Columbia Gorge", "Eastern Washington",
  "Mount St. Helens", "Toutle River", "Mayfield Dam", "Interstate 5",
  "Portland, Oregon (University of Portland; Portland State)", "Clatskanie, Oregon", "St. Helens, Oregon", "Wauna, Oregon",
  "Roseburg, Oregon", "Sutherlin, Oregon", "Medford, Oregon", "Sisters, Oregon", "Mt. Bachelor", "Mt. Hood", "Deschutes River",
  "Boise State",
  "Crownpoint, New Mexico (Crownpoint High School; St. Paul's Church)", "Navajo Nation", "North-central New Mexico",
  "Farmington, New Mexico (Farmington Library)", "Albuquerque, New Mexico",
  "Oklahoma City, Oklahoma",
  "Denver, Colorado", "Englewood, Colorado", "Our Lady of Loreto, Colorado",
  "St. John the Evangelist's Church",
  "Mendenhall Glacier, Alaska",
  "Hawaii (Maui; Oahu; Kauai)",
  "Edmonton, Canada", "Calgary, Canada", "Guam", "Vietnam",
  "Ireland (Dublin)", "Scotland (Edinburgh; St. Andrews; Oban; Loch Ness)",
  "France (Paris; Nice; Normandy)", "Monaco", "Amsterdam", "Vienna", "Salzburg", "Black Forest", "Czechoslovakia", "Finland",
  "Spain (Barcelona; Madrid; Granada; Toledo; Seville)", "Lisbon, Portugal", "Mont Blanc",
  "Iguazu Falls", "Buenos Aires", "Falkland Islands", "Patagonia", "Santiago Airport",
  "Peru (Lima; Cusco; the Sacred Valley of the Incas; Chinchero; Ollantaytambo; Machu Picchu)",
  "Quito, Ecuador", "Galapagos Islands (Santiago Island; Isabela Island; Rabida; Chinese Hat)",
  "Australia (Sydney; Ayers Rock; the Great Barrier Reef)", "New Zealand",
];
save(p);
console.log('Barbara card reorganized');
