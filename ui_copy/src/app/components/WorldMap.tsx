import { useState } from 'react';
import { Info } from 'lucide-react';

interface CountryData {
  name: string;
  value: number;
  details: {
    effectiveness: number;
    sideEffects: number;
    access: number;
    trust: number;
    competition: number;
  };
  population: string;
  dataPoints: string;
}

interface WorldMapProps {
  selectedMetric: string;
  selectedMedicine: string;
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
}

const countryData: Record<string, CountryData> = {
  'United States': {
    name: 'United States',
    value: 75,
    details: { effectiveness: 80, sideEffects: 42, access: 68, trust: 85, competition: 62 },
    population: '331M',
    dataPoints: '1.2M',
  },
  'Canada': {
    name: 'Canada',
    value: 78,
    details: { effectiveness: 82, sideEffects: 40, access: 75, trust: 88, competition: 58 },
    population: '38M',
    dataPoints: '145K',
  },
  'Mexico': {
    name: 'Mexico',
    value: 62,
    details: { effectiveness: 68, sideEffects: 50, access: 45, trust: 70, competition: 60 },
    population: '128M',
    dataPoints: '280K',
  },
  'Brazil': {
    name: 'Brazil',
    value: 58,
    details: { effectiveness: 62, sideEffects: 52, access: 38, trust: 65, competition: 55 },
    population: '213M',
    dataPoints: '420K',
  },
  'Argentina': {
    name: 'Argentina',
    value: 60,
    details: { effectiveness: 65, sideEffects: 48, access: 42, trust: 68, competition: 57 },
    population: '45M',
    dataPoints: '95K',
  },
  'Chile': {
    name: 'Chile',
    value: 67,
    details: { effectiveness: 72, sideEffects: 46, access: 58, trust: 75, competition: 59 },
    population: '19M',
    dataPoints: '85K',
  },
  'Peru': {
    name: 'Peru',
    value: 56,
    details: { effectiveness: 61, sideEffects: 51, access: 40, trust: 66, competition: 56 },
    population: '33M',
    dataPoints: '105K',
  },
  'Colombia': {
    name: 'Colombia',
    value: 59,
    details: { effectiveness: 64, sideEffects: 50, access: 44, trust: 68, competition: 58 },
    population: '51M',
    dataPoints: '145K',
  },
  'United Kingdom': {
    name: 'United Kingdom',
    value: 76,
    details: { effectiveness: 81, sideEffects: 41, access: 78, trust: 86, competition: 59 },
    population: '67M',
    dataPoints: '320K',
  },
  'France': {
    name: 'France',
    value: 74,
    details: { effectiveness: 79, sideEffects: 43, access: 76, trust: 84, competition: 58 },
    population: '65M',
    dataPoints: '285K',
  },
  'Germany': {
    name: 'Germany',
    value: 77,
    details: { effectiveness: 82, sideEffects: 40, access: 80, trust: 87, competition: 57 },
    population: '83M',
    dataPoints: '340K',
  },
  'Spain': {
    name: 'Spain',
    value: 72,
    details: { effectiveness: 77, sideEffects: 44, access: 74, trust: 82, competition: 60 },
    population: '47M',
    dataPoints: '210K',
  },
  'Italy': {
    name: 'Italy',
    value: 71,
    details: { effectiveness: 76, sideEffects: 45, access: 72, trust: 81, competition: 61 },
    population: '60M',
    dataPoints: '245K',
  },
  'Russia': {
    name: 'Russia',
    value: 55,
    details: { effectiveness: 60, sideEffects: 55, access: 35, trust: 62, competition: 65 },
    population: '144M',
    dataPoints: '180K',
  },
  'China': {
    name: 'China',
    value: 68,
    details: { effectiveness: 72, sideEffects: 55, access: 60, trust: 75, competition: 72 },
    population: '1.4B',
    dataPoints: '890K',
  },
  'India': {
    name: 'India',
    value: 64,
    details: { effectiveness: 70, sideEffects: 58, access: 45, trust: 72, competition: 68 },
    population: '1.4B',
    dataPoints: '650K',
  },
  'Japan': {
    name: 'Japan',
    value: 73,
    details: { effectiveness: 78, sideEffects: 46, access: 72, trust: 82, competition: 64 },
    population: '125M',
    dataPoints: '425K',
  },
  'South Korea': {
    name: 'South Korea',
    value: 74,
    details: { effectiveness: 79, sideEffects: 45, access: 74, trust: 83, competition: 66 },
    population: '52M',
    dataPoints: '240K',
  },
  'Australia': {
    name: 'Australia',
    value: 76,
    details: { effectiveness: 81, sideEffects: 42, access: 76, trust: 85, competition: 60 },
    population: '26M',
    dataPoints: '165K',
  },
  'South Africa': {
    name: 'South Africa',
    value: 52,
    details: { effectiveness: 58, sideEffects: 50, access: 30, trust: 62, competition: 48 },
    population: '60M',
    dataPoints: '125K',
  },
  'Nigeria': {
    name: 'Nigeria',
    value: 45,
    details: { effectiveness: 52, sideEffects: 48, access: 22, trust: 55, competition: 42 },
    population: '218M',
    dataPoints: '95K',
  },
  'Egypt': {
    name: 'Egypt',
    value: 58,
    details: { effectiveness: 64, sideEffects: 52, access: 40, trust: 68, competition: 50 },
    population: '104M',
    dataPoints: '140K',
  },
  'Saudi Arabia': {
    name: 'Saudi Arabia',
    value: 65,
    details: { effectiveness: 70, sideEffects: 48, access: 58, trust: 74, competition: 52 },
    population: '35M',
    dataPoints: '110K',
  },
  'Turkey': {
    name: 'Turkey',
    value: 63,
    details: { effectiveness: 68, sideEffects: 50, access: 52, trust: 71, competition: 56 },
    population: '85M',
    dataPoints: '205K',
  },
  'Indonesia': {
    name: 'Indonesia',
    value: 61,
    details: { effectiveness: 66, sideEffects: 54, access: 48, trust: 69, competition: 62 },
    population: '274M',
    dataPoints: '320K',
  },
  'Thailand': {
    name: 'Thailand',
    value: 67,
    details: { effectiveness: 72, sideEffects: 51, access: 62, trust: 74, competition: 64 },
    population: '70M',
    dataPoints: '185K',
  },
  'Sweden': {
    name: 'Sweden',
    value: 79,
    details: { effectiveness: 83, sideEffects: 39, access: 82, trust: 89, competition: 55 },
    population: '10M',
    dataPoints: '78K',
  },
  'Norway': {
    name: 'Norway',
    value: 80,
    details: { effectiveness: 84, sideEffects: 38, access: 84, trust: 90, competition: 54 },
    population: '5M',
    dataPoints: '52K',
  },
  'Poland': {
    name: 'Poland',
    value: 69,
    details: { effectiveness: 73, sideEffects: 47, access: 66, trust: 77, competition: 59 },
    population: '38M',
    dataPoints: '165K',
  },
  'Ukraine': {
    name: 'Ukraine',
    value: 50,
    details: { effectiveness: 56, sideEffects: 52, access: 28, trust: 60, competition: 62 },
    population: '44M',
    dataPoints: '95K',
  },
  'Iran': {
    name: 'Iran',
    value: 54,
    details: { effectiveness: 60, sideEffects: 53, access: 35, trust: 64, competition: 58 },
    population: '85M',
    dataPoints: '125K',
  },
  'Vietnam': {
    name: 'Vietnam',
    value: 66,
    details: { effectiveness: 71, sideEffects: 52, access: 56, trust: 73, competition: 65 },
    population: '98M',
    dataPoints: '215K',
  },
  'Philippines': {
    name: 'Philippines',
    value: 63,
    details: { effectiveness: 68, sideEffects: 54, access: 50, trust: 70, competition: 63 },
    population: '112M',
    dataPoints: '240K',
  },
  'New Zealand': {
    name: 'New Zealand',
    value: 78,
    details: { effectiveness: 82, sideEffects: 41, access: 77, trust: 86, competition: 57 },
    population: '5M',
    dataPoints: '48K',
  },
  'Kazakhstan': {
    name: 'Kazakhstan',
    value: 57,
    details: { effectiveness: 62, sideEffects: 52, access: 42, trust: 65, competition: 60 },
    population: '19M',
    dataPoints: '68K',
  },
  'Algeria': {
    name: 'Algeria',
    value: 53,
    details: { effectiveness: 59, sideEffects: 51, access: 36, trust: 63, competition: 52 },
    population: '44M',
    dataPoints: '92K',
  },
  'Libya': {
    name: 'Libya',
    value: 48,
    details: { effectiveness: 54, sideEffects: 49, access: 28, trust: 58, competition: 47 },
    population: '7M',
    dataPoints: '28K',
  },
  'Kenya': {
    name: 'Kenya',
    value: 51,
    details: { effectiveness: 57, sideEffects: 50, access: 32, trust: 61, competition: 49 },
    population: '54M',
    dataPoints: '105K',
  },
  'Ethiopia': {
    name: 'Ethiopia',
    value: 46,
    details: { effectiveness: 53, sideEffects: 48, access: 25, trust: 57, competition: 44 },
    population: '120M',
    dataPoints: '88K',
  },
  'Mongolia': {
    name: 'Mongolia',
    value: 61,
    details: { effectiveness: 66, sideEffects: 52, access: 48, trust: 69, competition: 58 },
    population: '3M',
    dataPoints: '22K',
  },
  'Greenland': {
    name: 'Greenland',
    value: 72,
    details: { effectiveness: 76, sideEffects: 44, access: 65, trust: 80, competition: 56 },
    population: '56K',
    dataPoints: '4K',
  },
  'Iceland': {
    name: 'Iceland',
    value: 81,
    details: { effectiveness: 85, sideEffects: 37, access: 85, trust: 91, competition: 53 },
    population: '370K',
    dataPoints: '12K',
  },
};

const getColorForValue = (value: number): string => {
  if (value >= 70) return '#22c55e';
  if (value >= 60) return '#84cc16';
  if (value >= 50) return '#eab308';
  if (value >= 40) return '#f97316';
  return '#ef4444';
};

// Simplified world map paths based on Equirectangular projection
const countryPaths: Record<string, string> = {
  'United States': 'M 150 180 L 160 175 L 170 170 L 185 165 L 200 162 L 215 160 L 230 158 L 245 160 L 255 165 L 265 170 L 275 175 L 283 182 L 290 190 L 295 200 L 298 210 L 298 220 L 295 230 L 290 238 L 283 245 L 275 250 L 265 253 L 255 255 L 245 256 L 235 255 L 225 253 L 215 250 L 205 248 L 195 247 L 185 248 L 175 250 L 165 253 L 155 257 L 150 255 L 145 250 L 142 240 L 140 230 L 140 220 L 142 210 L 145 200 L 148 190 Z',
  'Canada': 'M 145 120 L 160 115 L 175 112 L 190 110 L 210 108 L 230 107 L 250 108 L 270 110 L 285 113 L 300 117 L 310 122 L 318 128 L 323 135 L 325 143 L 325 152 L 323 160 L 318 167 L 310 172 L 300 175 L 285 177 L 270 178 L 250 177 L 230 175 L 210 172 L 190 168 L 175 163 L 160 157 L 150 150 L 145 143 L 143 135 L 143 127 Z',
  'Mexico': 'M 160 260 L 175 258 L 190 257 L 205 258 L 220 260 L 235 263 L 245 267 L 250 272 L 252 278 L 250 284 L 245 289 L 238 293 L 230 295 L 220 296 L 210 295 L 200 293 L 190 290 L 180 286 L 170 281 L 165 275 L 162 268 Z',
  'Brazil': 'M 295 310 L 310 308 L 325 307 L 340 308 L 355 310 L 368 313 L 378 318 L 385 325 L 390 333 L 393 342 L 395 352 L 395 363 L 393 374 L 390 385 L 385 395 L 378 404 L 368 411 L 355 416 L 340 419 L 325 420 L 310 419 L 295 416 L 282 411 L 272 404 L 265 395 L 260 385 L 257 374 L 255 363 L 255 352 L 257 342 L 260 333 L 265 325 L 272 318 L 282 313 Z',
  'Argentina': 'M 270 425 L 280 423 L 290 422 L 298 423 L 305 426 L 310 431 L 313 438 L 315 447 L 315 458 L 313 470 L 310 482 L 305 493 L 298 502 L 290 508 L 280 511 L 270 512 L 260 510 L 252 505 L 246 498 L 242 489 L 240 479 L 240 468 L 242 457 L 246 447 L 252 438 L 260 431 Z',
  'Chile': 'M 255 420 L 262 418 L 268 417 L 273 418 L 277 421 L 280 426 L 281 433 L 281 442 L 280 453 L 278 465 L 275 478 L 271 492 L 266 505 L 260 515 L 254 520 L 248 518 L 243 513 L 240 505 L 238 495 L 237 483 L 238 470 L 240 457 L 243 445 L 246 434 L 250 425 Z',
  'Peru': 'M 265 305 L 275 303 L 285 302 L 293 303 L 300 306 L 305 311 L 308 318 L 310 327 L 310 337 L 308 347 L 305 356 L 300 363 L 293 368 L 285 371 L 275 372 L 265 370 L 257 366 L 251 360 L 247 352 L 245 343 L 245 333 L 247 324 L 251 316 L 257 310 Z',
  'Colombia': 'M 265 285 L 275 283 L 285 282 L 293 283 L 300 286 L 305 291 L 308 297 L 310 304 L 310 311 L 308 318 L 305 324 L 300 329 L 293 332 L 285 333 L 275 332 L 265 329 L 257 324 L 251 318 L 247 311 L 245 304 L 245 297 L 247 291 L 251 286 L 257 283 Z',
  'United Kingdom': 'M 465 155 L 472 153 L 478 152 L 483 153 L 487 156 L 490 160 L 491 165 L 491 171 L 490 176 L 487 180 L 483 183 L 478 184 L 472 183 L 465 181 L 460 177 L 457 172 L 456 166 L 457 161 L 460 157 Z',
  'France': 'M 480 185 L 490 183 L 500 182 L 508 183 L 515 186 L 520 191 L 523 197 L 525 204 L 525 211 L 523 218 L 520 223 L 515 227 L 508 229 L 500 230 L 490 229 L 480 227 L 472 223 L 466 218 L 462 211 L 460 204 L 460 197 L 462 191 L 466 186 L 472 183 Z',
  'Germany': 'M 515 160 L 525 158 L 535 157 L 543 158 L 550 161 L 555 166 L 558 172 L 560 179 L 560 186 L 558 193 L 555 198 L 550 202 L 543 204 L 535 205 L 525 204 L 515 202 L 507 198 L 501 193 L 497 186 L 495 179 L 495 172 L 497 166 L 501 161 L 507 158 Z',
  'Spain': 'M 470 200 L 480 198 L 490 197 L 498 198 L 505 201 L 510 206 L 513 212 L 515 219 L 515 226 L 513 233 L 510 238 L 505 242 L 498 244 L 490 245 L 480 244 L 470 242 L 462 238 L 456 233 L 452 226 L 450 219 L 450 212 L 452 206 L 456 201 L 462 198 Z',
  'Italy': 'M 520 200 L 528 198 L 535 197 L 541 198 L 546 201 L 550 206 L 552 212 L 553 219 L 552 227 L 550 235 L 546 242 L 541 247 L 535 250 L 528 251 L 520 250 L 513 247 L 508 242 L 505 235 L 503 227 L 503 219 L 505 212 L 508 206 L 513 201 Z',
  'Russia': 'M 530 90 L 580 88 L 630 87 L 680 88 L 730 90 L 780 93 L 830 97 L 880 102 L 920 108 L 950 115 L 970 123 L 985 132 L 995 142 L 1000 153 L 1000 165 L 995 176 L 985 185 L 970 192 L 950 197 L 920 200 L 880 202 L 830 203 L 780 202 L 730 200 L 680 197 L 630 193 L 580 188 L 540 182 L 520 175 L 510 167 L 505 157 L 503 146 L 505 135 L 510 125 L 520 115 L 530 105 Z',
  'China': 'M 730 200 L 765 198 L 800 197 L 835 198 L 870 201 L 900 206 L 925 213 L 945 222 L 960 233 L 970 245 L 975 258 L 977 272 L 975 286 L 970 299 L 960 310 L 945 319 L 925 326 L 900 330 L 870 332 L 835 332 L 800 330 L 765 326 L 735 320 L 715 311 L 700 300 L 690 287 L 685 273 L 683 258 L 685 244 L 690 231 L 700 220 L 715 211 Z',
  'India': 'M 685 265 L 705 263 L 725 262 L 745 263 L 763 266 L 778 271 L 790 278 L 800 287 L 807 297 L 812 308 L 815 320 L 815 332 L 812 344 L 807 355 L 800 364 L 790 371 L 778 376 L 763 379 L 745 380 L 725 379 L 705 376 L 688 371 L 675 364 L 665 355 L 658 344 L 653 332 L 650 320 L 650 308 L 653 297 L 658 287 L 665 278 L 675 271 Z',
  'Japan': 'M 930 215 L 942 213 L 953 212 L 963 213 L 971 216 L 977 221 L 981 227 L 983 235 L 983 244 L 981 253 L 977 261 L 971 267 L 963 271 L 953 273 L 942 272 L 930 269 L 921 264 L 915 257 L 911 249 L 909 240 L 909 231 L 911 223 L 915 217 L 921 213 Z',
  'South Korea': 'M 910 230 L 918 228 L 925 227 L 931 228 L 936 231 L 940 236 L 942 242 L 943 249 L 942 256 L 940 262 L 936 267 L 931 270 L 925 271 L 918 270 L 910 267 L 904 262 L 900 256 L 898 249 L 898 242 L 900 236 L 904 231 Z',
  'Australia': 'M 820 420 L 860 418 L 900 417 L 935 418 L 965 421 L 990 426 L 1010 433 L 1025 442 L 1035 453 L 1040 465 L 1042 478 L 1040 491 L 1035 503 L 1025 513 L 1010 521 L 990 527 L 965 530 L 935 531 L 900 530 L 860 527 L 825 521 L 800 512 L 780 500 L 765 486 L 755 471 L 750 455 L 748 439 L 750 424 L 755 411 L 765 401 L 780 393 L 800 387 Z',
  'South Africa': 'M 545 455 L 560 453 L 575 452 L 588 453 L 600 456 L 610 461 L 618 468 L 624 477 L 628 487 L 630 498 L 628 509 L 624 519 L 618 527 L 610 533 L 600 537 L 588 539 L 575 539 L 560 537 L 547 533 L 537 527 L 530 519 L 525 509 L 523 498 L 525 487 L 530 477 L 537 468 Z',
  'Nigeria': 'M 510 315 L 522 313 L 533 312 L 543 313 L 552 316 L 559 321 L 564 328 L 567 336 L 568 345 L 567 354 L 564 362 L 559 368 L 552 372 L 543 374 L 533 374 L 522 372 L 512 368 L 505 362 L 500 354 L 497 345 L 496 336 L 497 328 L 500 321 L 505 316 Z',
  'Egypt': 'M 540 245 L 552 243 L 563 242 L 573 243 L 582 246 L 589 251 L 594 258 L 597 266 L 598 275 L 597 284 L 594 292 L 589 298 L 582 302 L 573 304 L 563 304 L 552 302 L 542 298 L 535 292 L 530 284 L 527 275 L 526 266 L 527 258 L 530 251 L 535 246 Z',
  'Saudi Arabia': 'M 590 260 L 605 258 L 620 257 L 633 258 L 645 261 L 655 266 L 663 273 L 669 282 L 673 292 L 675 303 L 673 314 L 669 324 L 663 332 L 655 338 L 645 342 L 633 344 L 620 344 L 605 342 L 592 338 L 582 332 L 575 324 L 570 314 L 567 303 L 567 292 L 570 282 L 575 273 L 582 266 Z',
  'Turkey': 'M 555 220 L 570 218 L 585 217 L 598 218 L 610 221 L 620 226 L 628 233 L 633 241 L 636 250 L 636 259 L 633 268 L 628 275 L 620 280 L 610 283 L 598 284 L 585 283 L 570 280 L 557 275 L 548 268 L 542 259 L 538 250 L 537 241 L 538 233 L 542 226 L 548 221 Z',
  'Indonesia': 'M 800 365 L 820 363 L 840 362 L 860 363 L 880 366 L 898 371 L 913 378 L 925 387 L 933 398 L 938 410 L 940 423 L 938 436 L 933 447 L 925 456 L 913 463 L 898 468 L 880 471 L 860 472 L 840 471 L 820 468 L 802 463 L 788 456 L 778 447 L 771 436 L 767 423 L 765 410 L 767 398 L 771 387 L 778 378 L 788 371 Z',
  'Thailand': 'M 815 320 L 827 318 L 838 317 L 848 318 L 857 321 L 864 326 L 869 333 L 872 341 L 873 350 L 872 359 L 869 367 L 864 373 L 857 377 L 848 379 L 838 379 L 827 377 L 817 373 L 810 367 L 805 359 L 802 350 L 801 341 L 802 333 L 805 326 L 810 321 Z',
  'Sweden': 'M 520 110 L 528 108 L 535 107 L 541 108 L 546 111 L 550 116 L 552 122 L 553 129 L 552 137 L 550 145 L 546 152 L 541 157 L 535 160 L 528 161 L 520 160 L 513 157 L 508 152 L 505 145 L 503 137 L 503 129 L 505 122 L 508 116 L 513 111 Z',
  'Norway': 'M 505 85 L 513 83 L 520 82 L 526 83 L 531 86 L 535 91 L 537 97 L 538 104 L 537 112 L 535 120 L 531 127 L 526 132 L 520 135 L 513 136 L 505 135 L 498 132 L 493 127 L 490 120 L 488 112 L 488 104 L 490 97 L 493 91 L 498 86 Z',
  'Poland': 'M 530 155 L 540 153 L 550 152 L 558 153 L 565 156 L 570 161 L 573 167 L 575 174 L 575 181 L 573 188 L 570 193 L 565 197 L 558 199 L 550 200 L 540 199 L 530 197 L 522 193 L 516 188 L 512 181 L 510 174 L 510 167 L 512 161 L 516 156 L 522 153 Z',
  'Ukraine': 'M 565 170 L 580 168 L 595 167 L 608 168 L 620 171 L 630 176 L 638 183 L 643 191 L 646 200 L 646 209 L 643 218 L 638 225 L 630 230 L 620 233 L 608 234 L 595 233 L 580 230 L 567 225 L 558 218 L 552 209 L 548 200 L 546 191 L 546 183 L 548 176 L 552 171 L 558 168 Z',
  'Iran': 'M 625 245 L 642 243 L 658 242 L 673 243 L 687 246 L 699 251 L 709 258 L 716 267 L 721 277 L 724 288 L 724 300 L 721 311 L 716 321 L 709 329 L 699 335 L 687 339 L 673 341 L 658 341 L 642 339 L 628 335 L 618 329 L 611 321 L 606 311 L 603 300 L 603 288 L 606 277 L 611 267 L 618 258 Z',
  'Vietnam': 'M 845 290 L 857 288 L 868 287 L 878 288 L 887 291 L 894 296 L 899 303 L 902 311 L 903 320 L 902 329 L 899 337 L 894 343 L 887 347 L 878 349 L 868 349 L 857 347 L 847 343 L 840 337 L 835 329 L 832 320 L 831 311 L 832 303 L 835 296 L 840 291 Z',
  'Philippines': 'M 885 305 L 895 303 L 904 302 L 912 303 L 919 306 L 924 311 L 927 317 L 929 324 L 929 332 L 927 340 L 924 346 L 919 350 L 912 352 L 904 352 L 895 350 L 887 346 L 881 340 L 877 332 L 875 324 L 875 317 L 877 311 L 881 306 Z',
  'New Zealand': 'M 1035 495 L 1045 493 L 1054 492 L 1062 493 L 1069 496 L 1074 501 L 1077 507 L 1079 514 L 1079 522 L 1077 530 L 1074 536 L 1069 540 L 1062 542 L 1054 542 L 1045 540 L 1037 536 L 1032 530 L 1029 522 L 1027 514 L 1027 507 L 1029 501 L 1032 496 Z',
  'Kazakhstan': 'M 630 155 L 660 153 L 690 152 L 718 153 L 744 156 L 767 161 L 787 168 L 803 177 L 815 188 L 823 200 L 828 213 L 830 227 L 828 241 L 823 254 L 815 265 L 803 274 L 787 281 L 767 286 L 744 289 L 718 290 L 690 289 L 660 286 L 635 281 L 618 274 L 606 265 L 598 254 L 593 241 L 591 227 L 593 213 L 598 200 L 606 188 L 618 177 Z',
  'Algeria': 'M 485 245 L 505 243 L 525 242 L 543 243 L 559 246 L 573 251 L 585 258 L 594 267 L 600 277 L 604 288 L 606 300 L 604 312 L 600 323 L 594 332 L 585 339 L 573 344 L 559 347 L 543 348 L 525 347 L 505 344 L 487 339 L 473 332 L 463 323 L 456 312 L 451 300 L 449 288 L 451 277 L 456 267 L 463 258 L 473 251 Z',
  'Libya': 'M 520 255 L 535 253 L 550 252 L 563 253 L 575 256 L 585 261 L 593 268 L 599 277 L 603 287 L 605 298 L 603 309 L 599 319 L 593 327 L 585 333 L 575 337 L 563 339 L 550 339 L 535 337 L 522 333 L 512 327 L 505 319 L 500 309 L 497 298 L 497 287 L 500 277 L 505 268 L 512 261 Z',
  'Kenya': 'M 580 350 L 592 348 L 603 347 L 613 348 L 622 351 L 629 356 L 634 363 L 637 371 L 639 380 L 639 389 L 637 398 L 634 405 L 629 411 L 622 415 L 613 417 L 603 417 L 592 415 L 582 411 L 575 405 L 570 398 L 567 389 L 565 380 L 565 371 L 567 363 L 570 356 L 575 351 Z',
  'Ethiopia': 'M 590 330 L 603 328 L 615 327 L 626 328 L 636 331 L 644 336 L 650 343 L 654 351 L 656 360 L 656 370 L 654 380 L 650 389 L 644 396 L 636 401 L 626 404 L 615 405 L 603 404 L 592 401 L 584 396 L 578 389 L 574 380 L 572 370 L 572 360 L 574 351 L 578 343 L 584 336 Z',
  'Mongolia': 'M 770 165 L 790 163 L 810 162 L 828 163 L 844 166 L 858 171 L 870 178 L 879 187 L 885 197 L 889 208 L 890 220 L 889 232 L 885 243 L 879 252 L 870 259 L 858 265 L 844 269 L 828 271 L 810 271 L 790 269 L 772 265 L 758 259 L 748 252 L 741 243 L 736 232 L 733 220 L 733 208 L 736 197 L 741 187 L 748 178 L 758 171 Z',
  'Greenland': 'M 340 45 L 365 43 L 390 42 L 413 43 L 434 46 L 452 51 L 467 58 L 479 67 L 488 78 L 494 90 L 497 103 L 497 117 L 494 130 L 488 142 L 479 152 L 467 160 L 452 166 L 434 170 L 413 172 L 390 172 L 365 170 L 342 166 L 323 160 L 308 152 L 297 142 L 289 130 L 284 117 L 282 103 L 284 90 L 289 78 L 297 67 L 308 58 L 323 51 Z',
  'Iceland': 'M 450 135 L 460 133 L 470 132 L 479 133 L 487 136 L 493 141 L 497 147 L 499 154 L 499 162 L 497 170 L 493 177 L 487 182 L 479 185 L 470 186 L 460 185 L 452 182 L 446 177 L 442 170 L 440 162 L 440 154 L 442 147 L 446 141 Z',
};

export default function WorldMap({ selectedMetric, selectedMedicine, timeRange, onTimeRangeChange }: WorldMapProps) {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const getMetricValue = (country: CountryData): number => {
    switch (selectedMetric) {
      case 'effectiveness':
        return country.details.effectiveness;
      case 'sideEffects':
        return country.details.sideEffects;
      case 'access':
        return country.details.access;
      case 'trust':
        return country.details.trust;
      case 'competition':
        return country.details.competition;
      default:
        return country.value;
    }
  };

  const handleCountryHover = (countryName: string, event: React.MouseEvent) => {
    setHoveredCountry(countryName);
    setTooltipPosition({ x: event.clientX, y: event.clientY });
  };

  return (
    <div className="size-full flex flex-col bg-[#0a0f1a]">
      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-[#0d1219]/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-700">
        <Info className="w-4 h-4 text-gray-400" />
        <span className="text-xs text-gray-400">Last updated: 7 days ago</span>
        <div className="h-4 w-px bg-gray-700 mx-2" />
        {['7 Days', '30 Days', '90 Days', '1 Year'].map((range) => (
          <button
            key={range}
            onClick={() => onTimeRangeChange(range)}
            className={`text-xs px-3 py-1 rounded ${
              timeRange === range
                ? 'bg-blue-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {range}
          </button>
        ))}
      </div>

      {/* SVG World Map */}
      <div className="flex-1 relative flex items-center justify-center p-4">
        <svg
          viewBox="0 0 1100 550"
          className="w-full h-full"
          style={{ maxWidth: '100%', maxHeight: '100%' }}
        >
          {/* Black background (ocean) */}
          <rect width="1100" height="550" fill="#000000" />
          
          {/* Render all countries */}
          {Object.entries(countryPaths).map(([countryName, path]) => {
            const data = countryData[countryName];
            if (!data) return null;
            
            return (
              <path
                key={countryName}
                d={path}
                fill={getColorForValue(getMetricValue(data))}
                stroke="#333333"
                strokeWidth="1"
                onMouseEnter={(e) => handleCountryHover(countryName, e)}
                onMouseLeave={() => setHoveredCountry(null)}
                className="cursor-pointer transition-all hover:stroke-white hover:stroke-2"
                style={{ 
                  filter: hoveredCountry === countryName ? 'brightness(1.2)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              />
            );
          })}
        </svg>

        {/* Legend */}
        <div className="absolute bottom-8 left-8 bg-[#0d1219]/95 backdrop-blur-sm p-4 rounded-lg border border-gray-700 shadow-xl">
          <h4 className="text-xs font-semibold text-gray-400 mb-3">PERCEPTION INDEX</h4>
          <div className="space-y-2">
            {[
              { label: 'Excellent (≥70)', color: '#22c55e' },
              { label: 'Good (60-69)', color: '#84cc16' },
              { label: 'Fair (50-59)', color: '#eab308' },
              { label: 'Poor (40-49)', color: '#f97316' },
              { label: 'Critical (<40)', color: '#ef4444' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <div
                  className="w-6 h-4 rounded border border-gray-600"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-gray-300">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tooltip */}
        {hoveredCountry && countryData[hoveredCountry] && (
          <div
            className="fixed z-50 bg-[#0d1219] border-2 border-blue-500/50 rounded-lg p-4 shadow-2xl pointer-events-none"
            style={{
              left: `${Math.min(tooltipPosition.x + 15, window.innerWidth - 260)}px`,
              top: `${Math.min(tooltipPosition.y + 15, window.innerHeight - 300)}px`,
              minWidth: '240px',
            }}
          >
            <div className="font-semibold text-lg mb-1">{hoveredCountry}</div>
            <div className="text-xs text-gray-400 mb-3">
              {countryData[hoveredCountry].population} • {countryData[hoveredCountry].dataPoints} data points
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                <span className="text-sm text-gray-300">Perception Score</span>
                <span className="text-xl font-bold" style={{ color: getColorForValue(getMetricValue(countryData[hoveredCountry])) }}>
                  {getMetricValue(countryData[hoveredCountry])}
                </span>
              </div>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Effectiveness</span>
                  <span className="font-medium">{countryData[hoveredCountry].details.effectiveness}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Side Effects</span>
                  <span className="font-medium">{countryData[hoveredCountry].details.sideEffects}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Access</span>
                  <span className="font-medium">{countryData[hoveredCountry].details.access}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Trust in Evidence</span>
                  <span className="font-medium">{countryData[hoveredCountry].details.trust}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Competition</span>
                  <span className="font-medium">{countryData[hoveredCountry].details.competition}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
