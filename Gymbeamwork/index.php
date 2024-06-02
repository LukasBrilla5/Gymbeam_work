<?php
error_reporting(E_ERROR | E_PARSE);
require 'vendor/autoload.php';

use Sentiment\Analyzer;

function getSentimentScore($text) {
    $analyzer = new Analyzer();
    return $analyzer->getSentiment($text);
}

function findExtremeSentiments($productData) {
    $mostPositiveScore = 0;
    $mostNegativeScore = 0;
    $mostPositiveDescription = "";
    $mostNegativeDescription = "";
  
  foreach ($productData as $product) {
      $scoreData = getSentimentScore($product['description']);
      $scorePos = $scoreData['pos']; 
      $scoreNeg = $scoreData['neg'];

      if ($scorePos > $mostPositiveScore) {
          $mostPositiveScore = $scorePos;
          $mostPositiveDescription = $product;
      }
      if ($scoreNeg > $mostNegativeScore) {
          $mostNegativeScore = $scoreNeg;
          $mostNegativeDescription = $product;
      }
  }

    return array(
        'most_positive' => $mostPositiveDescription,
        'most_negative' => $mostNegativeDescription
    );
}

$csvFile = 'dataset/dataset.csv'; 
$productData = []; 

if (($handle = fopen($csvFile, "r")) !== FALSE) {
    while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {

        $productData[] = [
            'name' => $data[0],
            'description' => $data[1]
        ];
    }
    fclose($handle);
}

$extremeSentiments = findExtremeSentiments($productData);

echo "Most positive product:<br>";
echo "Name: " . $extremeSentiments['most_positive']['name'] . "<br>";
echo "Description: " . $extremeSentiments['most_positive']['description'];

echo "Most negative product:<br>";
echo "Name: " . $extremeSentiments['most_negative']['name'] . "<br>";
echo "Description: " . $extremeSentiments['most_negative']['description'];
?>
