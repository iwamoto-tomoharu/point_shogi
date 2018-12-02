//難易度を定義するためのパラメータ
//X軸:悪手値(0〜1) Y軸:点数(-100〜100) の一次関数
//y>=0 と y<0 の場合で、2つの一次関数を定義する
// ２つの一次関数はX軸で交わる
export default interface DifficultyParam {
    xAxisVertexX: number; //X軸交点のXの値 (悪手値がこの値以上だと点数がマイナスになる)(この値が0に近づくほど難易度が高くなる)
    pointPlusFuncSlope: number; //y>=0の一次関数の傾き(この値が0に近づくほど難易度が高くなる)
    pointMinusFuncSlope: number;//y<0の一次関数の傾き(この値が0に近づくほど難易度が低くなる)
    maxPoint: number; //ポイントの最大値
    minPoint: number; //ポイントの最小値
}