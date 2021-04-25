[Home](https://andre-ye.github.io) > [Najafian Lab Navigation](https://andre-ye.github.io/research/najafian-lab/navigation) > Notes > Introduction Classes

## Notes on Dr. Najafian Introduction Class
Andre Ye, 4/24/2021

<br>

---

<br>

### Navigate
- [Podocytes](#podocytes)
  * [Normal Podocyte Operation](#normal-podocyte-operation)
  * [Podocyte Injury](#podocyte-injury)
- [Buffon's Needle Problem and the Quantification Problem](#buffons-needle-problem-and-the-quantification-problem)
- [Automating Quantification with Machine Learning](#automating-quantification-with-machine-learning)
- [Biased Sampling](#biased-sampling)
  * [Unbiased Morphometry (Stereology)](#unbiased-morphometry-stereology)
  * [Transmission Electron Microscopy](#transmission-electron-microscopy)
  
<br>

---

<br>

### Podocytes
- Scanning electron microscopy image of a portion of the glomerulus.
- Glomerulus: filtering unit of the kidney.
  - Composed of a network of capillaries.
  - Filtrates pass through the pores in the capillaries, basin membrane material, and reach the podocytes.

![](https://andre-ye.github.io/research/najafian-lab/notes/images/podocytes.png)

- Each of the bumps/blobs in the image is a cell body; the nucleus is inside them.
- Cells send primary processes (large veins), which are divided into secondary processes (smaller veins), which give rise to tertiary processes (the small "fingers").
- Scanning electron microscopy is grayscale, so colors are not true colors.
  - Cells are colored pink and yellow to demonstrate that a cell does not make junctions with itself, but with other cells. True for most cells; 99.99%.
- Each of the processes is coming from one cell.
- The plasma passes through slits (gaps through the "fingers").

#### Normal Podocyte Operation
- Slit, gaps between processes from which the plasma leaves.
- Cut the three-dimensional object and retrieve a two-dimensional image under transmission electron microscopy.
  - Can see capillary lumen, membrane, lining, processes.
  - Each process makes a junction with the neighboring one, depicted as a very faint line.

#### Podocyte Injury
- Normal podocyte has a body, primary processes, secondary processes, tertiary, etc.
- When the podocytes are injured because of different mechanisms, then *they become flattened*.
  - They lose their elaborate processes, and the processes become widened.
- In conditions of podocyte injury, the exits become very limited, increasing resistance.
- Tiny foot processes with slits are normal, but when the processes widen, there are longer stripes of foot processes; no longer quite "fingers". Slit shape and location are altered.
- **How do we quantify the injury?**
  - To quantify the extent of the *widening* of the foot processes.

<br>

---

<br>

### Buffon's Needle Problem and the Quantification Problem
- Some background for the approach using quantification.
  - Automatic quantification using machine learning.
- What is the probability for a coin to land entirely within the boundaries of a single tile?
  - Depends on the diameter of the coin and the width of the tile.
- Transformed into a more inclusive condition: Suppose a needle is thrown at random on a floor marked with equidistant parallel lines. What is the probability that the needle will land on one of the lines?
- Came up with an equation that becomes very helpful in calculating surface and length density if you have "snapshots".
  - If the needles are pieces of a line that you have cut, you can calculate its length.
- Why are these concepts important? What is important about the problem?
- In the normal podocyte conditions, there are many slits like a line; if the cell is injured, the slits and processes "simplify".
  - If you know about the boundaries of the "puzzle pieces" in surface units, you can measure the complexity of the puzzle.
  - Extreme complexity is normal. We want many gaps for plasma to filter through.
  - Abnormal if it turns into tiles and larger puzzle pieces.
- Modifying the questions into a simpler one: if we have a surface and we can calculate the boundary of the puzzles, we have a representation of the complexity of the foot processes.
- "Surface per length": the width. There is no single-width; we are dealing with a puzzle.
- Measure the length of the blue line and the number of slits: we can get the distribution of widths of the foot processes.

<br>

---

<br>

### Automating Quantification with Machine Learning
- This process is manual, and it works fine. However, it is very time-consuming. It becomes expensive.
- We want to use machine learning to automate it.
- Neural network model (modification of UNet, ForkNet)
  - Teach the neural network what we are looking for (base of the podocytes). 
  - Count the number of slits.
  - Calculate the difference between each length. Normalize them, correct for magnification, etc.
- Is this the entire story? Feed image into the machine, the machine can find the base of the podocyte, count the number of slits, give you a number. *Is this good enough for us?*
- This whole story is all necessary and correct, but we always want to have a bigger picture. Do not fall into details without considering important parameters.

<br>

---

<br>

### Biased Sampling
- 1936 election between F.D. Roosevelt and A. Landon.
- 10,000,000 vote straw ballots sent out, got 2.3m back.
- Poll Results: 41% for Roosevelt, 55% for Landon. Significant difference.
- Election Results: 61% for Roosevelt, 37% for Landon.
- George Gallup ran 5,000 random samples and correctly predicted the results.
- Where is the problem? This lies in the nature of sampling.
- If you have a lot of variation, you need to perform unbiased sampling.
- We need to perform an unbiased sampling; the more heterogeneous our population is, we need to do more sampling.
- For the foot processes: not uniform. Distribution of foot processes even for *normal* podocyte functioning. If there is a lot of variation, perhaps we need to change our sampling strategy.

#### Unbiased Morphometry (Stereology)
- Follow a strategy not based upon a sample having a phenomenon that we "like" more.
- It is very dangerous if you are led by things that you like - be a good observer!
- If sampling is not done correctly, you can't rely on the answer - even if there is no effort in your quantification.

Attributes:
- Systematic uniform random sampling - unbiased.
- Reproducible
- Minimum judgment
- Accurate, if the right principles are applied
- Precision defined by design.

#### Transmission Electron Microscopy
- A "gun" emits electrons, which are guided using condenser apertures and lenses. Beams align.
- Electron reach beams are thrown into the sample; colors indicate if they pass through or not.
- A camera captures the image.

<br>

---

<br>

[Back to top](#)
